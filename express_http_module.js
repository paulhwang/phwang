/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: express_http_module.js
 */

module.exports = {
    post: function (req, res) {
        processPost(req, res);
    },
    
    get: function (req, res) {
        processGet(req, res);
    },

    not_found: function (req, res) {
        processNotFound(req, res);
    },
    
    failure: function (req, res) {
        processFailure(err, req, res, next);
    },
};

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var account_mgr = require("./session_mgr_module.js");
var link_mgr = require("./link_mgr_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var state;

function processPost(req, res) {
    var my_link_id, my_session, his_session;

    debug(false, "processPost", "start");
    debug(false, "processPost", "my_name=" + req.body.my_name + " link_id=" + req.body.link_id);
    state = "processPost start";

    my_link_id = Number(req.body.link_id);
    my_link = link_mgr.search(req.body.my_name, my_link_id);
    if (!my_link) {
        abend("processPost", "null my_link");
        return;
    }
    if (my_link.link_id === 0) {
        abend("processPost", "null my_link = 0");
        return;
    }

    var my_session_id = Number(req.body.session_id);
    my_session = account_mgr.search(req.body.my_name, req.body.his_name, my_session_id);
    if (!my_session) {
        abend("processPost", "null my_session");
        return;
    }
    if (my_session.session_id === 0) {
        abend("processPost", "null my_session = 0");
        return;
    }

    logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + "=>" + my_session.up_seq);

    if (req.body.my_name === req.body.his_name) {
        his_session = my_session;
    }
    else {
        his_session = account_mgr.search(req.body.his_name, req.body.my_name, -1);
        if (!his_session) {
            abend("processPost", "null his_session");
            return;
        }
        if (his_session.session_id === 0) {
            abend("processPost", "null his_session = 0");
            return;
        }
    }

    if (req.body.xmt_seq === my_session.up_seq) {
        queue.enqueue(his_session.queue, req.body.data);
        ring.enqueue(his_session.ring, req.body.data);
        my_session.up_seq += 1;
    } else if (req.body.xmt_seq < my_session.up_seq) {
         if (req.body.xmt_seq === 0) {
            queue.enqueue(his_session.queue, req.body.data);
            ring.enqueue(his_session.ring, req.body.data);
            my_session.up_seq = 1;
            logit("processPost", req.body.data + " post " + req.body.xmt_seq + " reset");
        } else {
            logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + " dropped");
        }
    } else {
        logit("***abend: processPost", req.body.data + " post seq=" + req.body.xmt_seq + " dropped");
    }
    state = "processPost end";
    debug(false, "processPost", "end");
}

function processGet (req, res) {
    if (req.headers.command === "setup_link") {
        initLink(req, res);
        return;
    }

    if (req.headers.command === "setup_session") {
        initSession(req, res);
        return;
    }

    if (req.headers.command === "get_name_list") {
        getNameList(req, res);
        return;
    }

    debug(false, "processGet ", "start");
    debug(false, "processGet ", "link=" + req.headers.session_id + " "  + req.headers.his_name + "=>" + req.headers.my_name);
    state = "processGet start";

    var my_link_id, session_id;

    my_link_id = Number(req.headers.link_id);
    my_link = link_mgr.search(req.headers.my_name, my_link_id);
    if (!my_link) {
        abend("processGet", "null my_link");
        return;
    }
    if (my_link.link_id === 0) {
        abend("processGet", "null my_link = 0");
        return;
    }
   
    session_id = Number(req.headers.session_id);
    var my_session = account_mgr.search(req.headers.my_name, req.headers.his_name, session_id);
    if (!my_session) {
        abend("processGet", "null my_session");
        return;
    }
    if (my_session.session_id === 0) {
        abend("processGet", "null my_session = 0");
        return;
    }
    if (!my_session.queue) {
        abend("processGet", "null queue");
        return;
    }
    res.type('application/json');
    state = "get 2000";
    var data = queue.dequeue(my_session.queue);
    state = "get 3000";
    var data1 = ring.dequeue(my_session.ring);
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

    logit("processGet ", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.his_name + "=>" + req.headers.my_name + " {" + data + "}");
    res.send(data);
    state = "processGet end";
    debug(false, "processGet ", "end");
}

function initLink (req, res) {
    state = "initLink start";
    var link, link_id_str;
    link = link_mgr.search_and_create(req.headers.my_name, 0);
    if (!link) {
        abend("initLink", "null link");
        return;
    }
    link_id_str = "" + link.link_id;
    res.send(link_id_str);
    logit("initLink   ", "(" + link.link_id + ",0) " + req.headers.my_name + "=>server");
    state = "initLink end";
}

function getNameList (req, res) {
    state = "getNameList start";
    var my_link_id;

    my_link_id = Number(req.headers.link_id);
    my_link = link_mgr.search(req.headers.my_name, my_link_id);
    if (!my_link) {
        abend("getNameList", "null my_link");
        return;
    }
    if (my_link.link_id === 0) {
        abend("getNameList", "null my_link = 0");
        return;
    }

    var name_list = link_mgr.get_name_list();
    res.send(name_list);
    logit("getNameList", "(" + link.link_id + ",0) " + req.headers.my_name + "=>server " + name_list);
    state = "getNameList end";
}

function initSession (req, res) {
    state = "initSession start";
    var session, session_id_str;
    session = account_mgr.search_and_create(req.headers.my_name, req.headers.his_name, 0);
    if (!session) {
        abend("initSession", "null session");
        return;
    }
    session_id_str = "" + session.session_id;
    res.send(session_id_str);
    logit("initSession", "(" + req.headers.link_id + "," + session.session_id + ") " + req.headers.his_name + "=>" + req.headers.my_name);
    state = "initSession end";
}

function processNotFound (req, res) {
    console.log(req.headers);
    logit("processNotFound", "*****");
    res.type('text/plain');
    res.status(404);
    res.send('Not Found');
}

function processFailure (err, req, res, next) {
    logit("processFailure", state);
}

function debug(debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function logit (str1_val, str2_val) {
    return util.utilLogit("NodeMain." + str1_val, str2_val);
}

function abend (str1_val, str2_val) {
    return util.utilAbend("NodeMain." + str1_val, str2_val);
}
