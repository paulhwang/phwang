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
    postLogit("processPost", "start");
    state = "post start";
    var acc = account_mgr.search(req.body.name);
    logit("processPost", req.body.data + " " + req.body.seq + " " + acc.up_seq);
    if (req.body.seq === acc.up_seq) {
        state = "post 1000";
        queue.enqueue(acc.queue, req.body.data);
        state = "post 1200";
        ring.enqueue(req.body.data);
        state = "post 1900";
        acc.up_seq += 1;
    } else if (req.body.seq < acc.up_seq) {
        state = "post 2000";
         if (req.body.seq === 0) {
            queue.enqueue(acc.queue, req.body.data);
            ring.enqueue(req.body.data);
            acc.up_seq = 1;
            console.log(req.body.data + " post " + req.body.seq + " reset");
        } else {
            console.log(req.body.data + " post " + req.body.seq + " dropped");
        }
    } else {
        state = "post 3000";
        console.log("***abend: " + req.body.data + " post seq=" + req.body.seq + " dropped");
    }
    state = "post done";
}

function processGet (req, res) {
    state = "get start";
    var acc = account_mgr.search(req.headers.name);
    if (!acc) {
        console.log("processGet() ", "name not found");
        return;
    }
    if (!acc.queue) {
        console.log("*****Abend:processGet() ", "null queue");
        return;
    }
    res.type('application/json');
    state = "get 2000";
    var data = queue.dequeue(acc.queue);
    state = "get 3000";
    var data1 = ring.dequeue();
    state = "get 4000";
    if (data !== data1) {
        console.log("*****Abend: get", "queue and ring not match");
    }
    if (!data) {
        //console.log("processGet() ", "null data");
        return;
    }
    state = "get 5000";
    logit("processGet ", data);
    state = "get 9000";
    res.send(data);
    state = "test start";
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
