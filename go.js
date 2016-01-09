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
    var my_session, his_session;

    postLogit("processPost", "start");
    state = "post start";

    var my_session_id = Number(req.body.link_id);
    my_session = account_mgr.search(req.body.my_name, req.body.his_name, my_session_id);
    if (!my_session) {
        abend("processPost", "null my_session");
        return;
    }
    if (my_session.link_id === 0) {
        abend("processPost", "null my_session = 0");
        return;
    }
    logit("processPost", "link=" + req.body.link_id + " "  + req.body.my_name + "=>" + req.body.his_name + " " + req.body.data + " " + req.body.xmt_seq + "=" + my_session.up_seq);
    if (req.body.my_name === req.body.his_name) {
        his_session = my_session;
    }
    else {
        his_session = account_mgr.search(req.body.his_name, req.body.my_name, -1);
        if (!his_session) {
            abend("processPost", "null his_session");
            return;
        }
        if (his_session.link_id === 0) {
            abend("processPost", "null his_session = 0");
            return;
        }
    }

    if (req.body.xmt_seq === my_session.up_seq) {
        state = "post 1000";
        queue.enqueue(his_session.queue, req.body.data);
        state = "post 1200";
        ring.enqueue(his_session.ring, req.body.data);
        state = "post 1900";
        my_session.up_seq += 1;
    } else if (req.body.xmt_seq < my_session.up_seq) {
        state = "post 2000";
         if (req.body.xmt_seq === 0) {
            queue.enqueue(his_session.queue, req.body.data);
            ring.enqueue(his_session.ring, req.body.data);
            my_session.up_seq = 1;
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

    if (req.headers.setup_session === "yes") {
        setupSession(req, res);
        return;
    }

    //logit("processGet ", "link=" + req.headers.link_id + " "  + req.headers.his_name + "=>" + req.headers.my_name);
    state = "get start";
    var link_id = Number(req.headers.link_id);
    var my_link = account_mgr.search(req.headers.my_name, req.headers.his_name, link_id);
    if (!my_link) {
        abend("processGet", "null my_link");
        return;
    }
    if (my_link.link_id === 0) {
        abend("processGet", "null my_link = 0");
        return;
    }
    if (!my_link.queue) {
        abend("processGet", "null queue");
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
    logit("processGet ", "link=" + req.headers.link_id + " "  + req.headers.his_name + "=>" + req.headers.my_name + " " + data);
    state = "get 9000";
    res.send(data);
    state = "get end";
}

function setupLink (req, res) {
    var link, link_id_str;
    link = account_mgr.search_and_create(req.headers.my_name, req.headers.his_name, 0);
    if (!link) {
        abend("setupLink", "null link");
        return;
    }
    link_id_str = "" + link.link_id;
    res.send(link_id_str);
    logit("setupLink  ", req.headers.his_name + "=>" + req.headers.my_name);
}

function setupSession (req, res) {
    var link, link_id_str;
    link = account_mgr.search_and_create(req.headers.my_name, req.headers.his_name, 0);
    if (!link) {
        abend("setupSession", "null session");
        return;
    }
    link_id_str = "" + link.link_id;
    res.send(link_id_str);
    logit("setupSession  ", req.headers.his_name + "=>" + req.headers.my_name);
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
