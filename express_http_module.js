/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: express_http_module.js
 */

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var account_mgr = require("./session_mgr_module.js");
var link_mgr = require("./link_mgr_module.js");
var link_entry = require("./link_entry_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var state;

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
        his_session = account_mgr.search(req.body.my_name, req.body.his_name, -1);
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
        queue.enqueue(his_session.receive_queue, req.body.data);
        ring.enqueue(his_session.receive_ring, req.body.data);
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
    if ((req.headers.command !== "keep_alive") &&
        (req.headers.command !== "get_name_list") &&
        (req.headers.command !== "get_session_data")) {
        debug(false, "processGet", "command=" + req.headers.command);
    }

    if (req.headers.command === "keep_alive") {
        keepAlive(req, res);
        return;
    }

    if (req.headers.command === "get_pending_data") {
        getPendingData(req, res);
        return;
    }

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

    if (req.headers.command === "get_session_data") {
        getSessionData(req, res);
        return;
    }

    if (req.headers.command === "put_session_data") {
        putSessionData(req, res);
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
    if (!my_session.receive_queue) {
        abend("processGet", "null receive_queue");
        return;
    }
    res.type('application/json');
    state = "get 2000";
    var data = queue.dequeue(my_session.receive_queue);
    state = "get 3000";
    var data1 = ring.dequeue(my_session.receive_ring);
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

function jsonStingifyData (command_val, ajax_id_val, data_val) {
    var json_str = JSON.stringify({
                    command: command_val,
                    ajax_id: ajax_id_val,
                    data: data_val,
                });
    return json_str;
}

function getSessionData (req, res) {
    //console.log(req.headers);
    debug(false, "getSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") my_name=" + req.headers.my_name + "=>" + req.headers.his_name);
    var link_id, session_id;

    link_id = Number(req.headers.link_id);
    link = link_mgr.search(req.headers.my_name, link_id);
    if (!link) {
        abend("getSessionData", "null link");
        return;
    }
    link_entry.keep_alive(link);

    session_id = Number(req.headers.session_id);
    var my_session = account_mgr.search(req.headers.my_name, req.headers.his_name, session_id);
    if (!my_session) {
        abend("getSessionData", "null my_session");
        return;
    }
    if (my_session.session_id === 0) {
        abend("getSessionData", "null my_session = 0");
        return;
    }
    if (!my_session.receive_queue) {
        abend("getSessionData", "null receive_queue");
        return;
    }
    res.type('application/json');
    if (queue.queue_size(my_session.receive_queue) === 0) {
        debug(false, "getSessionData", "empty queue");
        res.send(jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
        return;
    }

    //logit("getSessionData", "queue_size=" + queue.queue_size(my_session.receive_queue));
    var data = queue.dequeue(my_session.receive_queue);
    var data1 = ring.dequeue(my_session.receive_ring);
    if (data !== data1) {
        logit("*****Abend: getSessionData", "queue and ring not match");
    }
    if (!data) {
        logit("getSessionData", "null data");
        res.send(null);
        return;
    }

    var json_str = JSON.stringify({
                    command: req.headers.command,
                    ajax_id: req.headers.ajax_id,
                    data: data,
                });

    debug(false, "getSessionData", "ajax_id=" + req.headers.ajax_id);
    logit("getSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.his_name + "=>" + req.headers.my_name + " {" + data + "}");
    res.send(json_str);
}

function putSessionData (req, res) {
    //console.log(req.headers);
    debug(false, "putSessionData ", "ajax_id=" + req.headers.ajax_id);
    debug(false, "putSessionData ", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.his_name + "=>" + req.headers.my_name + " {" + req.headers.data + "}");

    var link_id = Number(req.headers.link_id);
    var session_id = Number(req.headers.session_id);
    var xmt_seq = Number(req.headers.xmt_seq);

    link = link_mgr.search(req.headers.my_name, link_id);
    if (!link) {
        abend("putSessionData", "null link");
        return;
    }
    link_entry.keep_alive(link);

    var my_session = account_mgr.search(req.headers.my_name, req.headers.his_name, session_id);
    if (!my_session) {
        abend("putSessionData", "null my_session");
        return;
    }
    if (my_session.session_id === 0) {
        abend("putSessionData", "null my_session = 0");
        return;
    }

    logit("putSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.my_name + "=>" + req.headers.his_name + " {" + req.headers.data + "} " + req.headers.xmt_seq + "=>" + my_session.up_seq);

    if (req.headers.my_name === req.headers.his_name) {
        his_session = my_session;
    }
    else {
        his_session = account_mgr.search(req.headers.my_name, req.headers.his_name, -1);
        if (!his_session) {
            abend("putSessionData", "null his_session");
            return;
        }
        if (his_session.session_id === 0) {
            abend("putSessionData", "null his_session = 0");
            return;
        }
    }

    if (xmt_seq === my_session.up_seq) {
        queue.enqueue(his_session.receive_queue, req.headers.data);
        ring.enqueue(his_session.receive_ring, req.headers.data);
        my_session.up_seq += 1;
    } else if (xmt_seq < my_session.up_seq) {
         if (xmt_seq === 0) {
            queue.enqueue(his_session.queue, req.headers.data);
            ring.enqueue(his_session.ring, req.headers.data);
            my_session.up_seq = 1;
            logit("putSessionData", req.headers.data + " post " + xmt_seq + " reset");
        } else {
            logit("putSessionData", "(" + link_id + "," + session_id + ") "  + req.headers.my_name + "=>" + req.headers.his_name + " {" + req.headers.data + "} " + xmt_seq + " dropped");
        }
    } else {
        logit("***abend: putSessionData", req.headers.data + " post seq=" + xmt_seq + " dropped");
    }

    //logit("putSessionData", "queue_size=" + queue.queue_size(my_session.receive_queue));
    res.send(jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
}

function getPendingData (req, res) {
    //logit("getPendingData", "");
    res.send("response from server for getPendingData");
}

function keepAlive (req, res) {
    state = "keepAlive start";
    var my_link_id = Number(req.headers.link_id);
    debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + req.headers.my_name);
    var link = link_mgr.search(req.headers.my_name, my_link_id);
    if (!link) {
        abend("keepAlive", "***null link***" + "link_id=" + my_link_id + " my_name=" + req.headers.my_name);
        return;
    }
    link_entry.keep_alive(link);
    var json_str = JSON.stringify({
                    command: req.headers.command,
                    ajax_id: req.headers.ajax_id,
                });
    res.send(json_str);
    state = "keepAlive end";
}

function initLink (req, res) {
    state = "initLink start";
    var link = link_mgr.search_and_create(req.headers.my_name, 0);
    if (!link) {
        abend("initLink", "null link");
        return;
    }
    var link_id_str = "" + link.link_id;
    var json_str = JSON.stringify({
                    command: req.headers.command,
                    ajax_id: req.headers.ajax_id,
                    data: link_id_str,
                });

    res.send(json_str);
    logit("initLink   ", "(" + link.link_id + ",0) " + req.headers.my_name + "=>server " + link_id_str);
    state = "initLink end";
}

function getNameList (req, res) {
    state = "getNameList start";
    var my_link_id;

    my_link_id = Number(req.headers.link_id);
    my_link = link_mgr.search(req.headers.my_name, my_link_id);
    if (!my_link) {
        abend("getNameList", "null my_link" + "link_id=" + my_link_id + " my_name=" + req.headers.my_name);
        return;
    }
    if (my_link.link_id === 0) {
        abend("getNameList", "null my_link = 0");
        return;
    }
    link_entry.keep_alive(my_link);

    var name_array = link_mgr.get_name_list();
    name_array_str = JSON.stringify(name_array);
    var json_str = JSON.stringify({
                    command: req.headers.command,
                    ajax_id: req.headers.ajax_id,
                    data: name_array_str,
                });
    res.send(json_str);
    debug(true, "getNameList", "(" + my_link.link_id + ",0) " + req.headers.my_name + "=>server " + name_array_str);
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
    var json_str = JSON.stringify({
                    command: req.headers.command,
                    ajax_id: req.headers.ajax_id,
                    data: session_id_str,
                });
    res.send(json_str);
    logit("initSession", "(" + req.headers.link_id + "," + session.session_id + ") " + req.headers.my_name + "=>" + req.headers.his_name);
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
