"use strict";

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var account = require("./account_entry_module.js");
var account_mgr = require("./account_mgr_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var state;

util.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/clients/util"));
app.use(express.static(__dirname + "/clients/go"));
app.post("/go_msg", processPost);
app.get("/go_msg", processGet);
app.use(processNotFount);
app.use(processFailure);
app.listen(8080);

function processPost(req, res) {
    var my_link, his_link;

    postLogit("processPost", "start");
    state = "post start";

    my_link = account_mgr.search(req.body.my_name, req.body.his_name);
    logit("processPost", req.body.my_name + "=>" + req.body.his_name + " " + req.body.data + " " + req.body.xmt_seq + "=" + my_link.up_seq);
    if (req.body.my_name === req.body.his_name) {
        his_link = my_link;
    }
    else {
        his_link = account_mgr.search(req.body.his_name, req.body.my_name);
    }

    if (req.body.xmt_seq === my_link.up_seq) {
        state = "post 1000";
        queue.enqueue(his_link.queue, req.body.data);
        state = "post 1200";
        ring.enqueue(his_link.ring, req.body.data);
        state = "post 1900";
        my_link.up_seq += 1;
    } else if (req.body.xmt_seq < my_link.up_seq) {
        state = "post 2000";
         if (req.body.xmt_seq === 0) {
            queue.enqueue(his_link.queue, req.body.data);
            ring.enqueue(his_link.ring, req.body.data);
            my_link.up_seq = 1;
            logit("processPost", req.body.data + " post " + req.body.xmt_seq + " reset");
        } else {
            logit("processPost", req.body.data + " post " + req.body.xmt_seq + " dropped");
        }
    } else {
        state = "post 3000";
        logit("***abend: processPost", req.body.data + " post seq=" + req.body.xmt_seq + " dropped");
    }
    state = "post end";
}

function processGet (req, res) {
    if (req.headers.setup_link === "yes") {
        setupLink(req, res);
        return;
    }

    logit("processGet ", req.headers.his_name + "=>" + req.headers.my_name);
    state = "get start";
    var my_link = account_mgr.search(req.headers.my_name, req.headers.his_name);
    if (!my_link) {
        logit("processGet", "name not found");
        return;
    }
    if (!my_link.queue) {
        logit("*****Abend:processGet", "null queue");
        return;
    }
    res.type('application/json');
    state = "get 2000";
    var data = queue.dequeue(my_link.queue);
    state = "get 3000";
    var data1 = ring.dequeue(my_link.ring);
    state = "get 4000";
    if (data !== data1) {
        logit("*****Abend: processGet", "queue and ring not match");
    }
    if (!data) {
        //logit("processGet", "null data");
        return;
    }
    if (!data1) {
        //logti("processGet", "null data1");
        return;
    }

    state = "get 5000";
    logit("processGet ", req.headers.his_name + "=>" + req.headers.my_name + " " + data);
    state = "get 9000";
    res.send(data);
    state = "get end";
}

function setupLink (req, res) {
    var link, link_id_str;
    link = account_mgr.search(req.body.my_name, req.body.his_name);
    link_id_str = "" + link.link_id;
    res.send(link_id_str);
    logit("setupLink  ", req.headers.his_name + "=>" + req.headers.my_name);
}

function processNotFount (req, res) {
    console.log("use" + req);
    res.type('text/plain');
    res.status(404);
    res.send('Not Found');
}

function processFailure (err, req, res, next) {
    console.log("express error: " + state);
}

function postLogit(str1_val, str2_val) {
    var debugPost = false;
    if (debugPost) {
        logit(str1_val, str2_val);
    }
}

function logit (str1_val, str2_val) {
    return util.utilLogit("NodeMain." + str1_val, str2_val);
}

function abend (str1_val, str2_val) {
    return util.utilAbend("NodeMain." + str1_val, str2_val);
}
