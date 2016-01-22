/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: express_http_module.js
 */

//var util = require("./util_module.js");
var root = require("./root_module.js");
var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var link_entry = require("./link_entry_module.js");
var express = require('express');
var bodyParser = require('body-parser');
var state;

var theExpressHttpObject = new ExpressHttpObject(root.object());

module.exports = {
    post: function (req, res) {
        theExpressHttpObject.processPost(req, res);
    },
    
    get: function (req, res) {
        theExpressHttpObject.processGet(req, res);
    },

    not_found: function (req, res) {
        theExpressHttpObject.processNotFound(req, res);
    },
    
    failure: function (req, res) {
        theExpressHttpObject.processFailure(err, req, res, next);
    },
};

function ExpressHttpObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "ExpressHttpObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.linkMgrObject = function () {
        return this.rootObject().linkMgrObject();
    };

    this.sessionMgrObject = function () {
        return this.rootObject().sessionMgrObject();
    };

    this.getLink = function (req, res) {
        var link_id = Number(req.headers.link_id);
        var link = this.linkMgrObject().searchLink(req.headers.my_name, link_id);
        if (!link) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("getLink", "null link" + "link_id=" + link_id + " my_name=" + req.headers.my_name);
            return null;
        }
        if (link.link_id === 0) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("getLink", "link_id = 0");
            return null;
        }
        return link;
    };

    this.processPost = function (req, res) {
        var my_link_id, my_session, his_session;

        this.debug(false, "processPost", "start");
        this.debug(false, "processPost", "my_name=" + req.body.my_name + " link_id=" + req.body.link_id);
        state = "processPost start";

        my_link_id = Number(req.body.link_id);
        my_link = this.linkMgrObject().search(req.body.my_name, my_link_id);
        if (!my_link) {
            this.abend("processPost", "null my_link");
            return;
        }
        if (my_link.link_id === 0) {
            this.abend("processPost", "null my_link = 0");
            return;
        }

        var my_session_id = Number(req.body.session_id);
        my_session = this.sessionMgrObject().search(req.body.my_name, req.body.his_name, my_session_id);
        if (!my_session) {
            this.abend("processPost", "null my_session");
            return;
        }
        if (my_session.session_id === 0) {
            this.abend("processPost", "null my_session = 0");
            return;
        }

        this.logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + "=>" + my_session.up_seq);

        if (req.body.my_name === req.body.his_name) {
            his_session = my_session;
        } else {
            his_session = this.sessionMgrObject().search(req.body.my_name, req.body.his_name, -1);
            if (!his_session) {
                this.abend("processPost", "null his_session");
                return;
            }
            if (his_session.session_id === 0) {
                this.abend("processPost", "null his_session = 0");
                return;
            }
        }

        if (req.body.xmt_seq === my_session.up_seq) {
            queue.enqueue(his_session.receiveQueue(), req.body.data);
            ring.enqueue(his_session.receiveRing(), req.body.data);
            my_session.up_seq += 1;
        } else if (req.body.xmt_seq < my_session.up_seq) {
            if (req.body.xmt_seq === 0) {
                queue.enqueue(his_session.queue, req.body.data);
                ring.enqueue(his_session.ring, req.body.data);
                my_session.up_seq = 1;
                this.logit("processPost", req.body.data + " post " + req.body.xmt_seq + " reset");
            } else {
                this.logit("processPost", "(" + req.body.link_id + "," + req.body.session_id + ") "  + req.body.my_name + "=>" + req.body.his_name + " {" + req.body.data + "} " + req.body.xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: processPost", req.body.data + " post seq=" + req.body.xmt_seq + " dropped");
        }
        state = "processPost end";
        this.debug(false, "processPost", "end");
    };

    this.processGet = function (req, res) {
        if ((req.headers.command !== "keep_alive") &&
            (req.headers.command !== "get_name_list") &&
            (req.headers.command !== "get_session_data")) {
            this.debug(false, "processGet", "command=" + req.headers.command);
        }

        if (req.headers.command === "setup_link") {
            this.setupLink(req, res);
            return;
        }

        if (req.headers.command === "keep_alive") {
            this.keepAlive(req, res);
            return;
        }

        if (req.headers.command === "get_link_data") {
            this.getLinkData(req, res);
            return;
        }

        if (req.headers.command === "put_link_data") {
            this.putLinkData(req, res);
            return;
        }

        if (req.headers.command === "get_name_list") {
            this.getNameList(req, res);
            return;
        }

        if (req.headers.command === "setup_session") {
            this.setupSession(req, res);
            return;
        }

        if (req.headers.command === "get_session_data") {
            this.getSessionData(req, res);
            return;
        }

        if (req.headers.command === "put_session_data") {
            this.putSessionData(req, res);
            return;
        }

        this.abend("processGet", "what?");
    };

    this.jsonStingifyData = function (command_val, ajax_id_val, data_val) {
        var json_str = JSON.stringify({
                        command: command_val,
                        ajax_id: ajax_id_val,
                        data: data_val,
                    });
        return json_str;
    };

    this.setupLink = function (req, res) {
        var link = this.linkMgrObject().searchAndCreate(req.headers.my_name, 0);
        if (!link) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("setupLink", "null link");
            return;
        } else {
            link.resetKeepAliveTimer();
        }

        var link_id_str = "" + link.linkId();
        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: link_id_str,
                    });

        res.send(json_str);
        this.logit("setupLink", "name=" + req.headers.my_name + " link_id=" + link.linkId());
    };

    this.keepAlive = function (req, res) {
        var my_link_id = Number(req.headers.link_id);
        this.debug(false, "keepAlive", "link_id=" + my_link_id + " my_name=" + req.headers.my_name);
        var link = this.linkMgrObject().searchLink(req.headers.my_name, my_link_id);
        if (!link) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("keepAlive", "***null link***" + "link_id=" + my_link_id + " my_name=" + req.headers.my_name);
            return;
        }
        link.resetKeepAliveTimer();

        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                    });
        res.send(json_str);
    };

    this.getLinkData = function (req, res) {
        this.debug(false, "getLinkData", "(" + req.headers.link_id + "," + req.headers.session_id + ") my_name=" + req.headers.my_name + "=>" + req.headers.his_name);

        var link = this.getLink(req, res);
        if (!link) {
            return;
        }
        link.resetKeepAliveTimer();

        var data = "hello get link data";
        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: data,
                    });

        this.debug(false, "getLinkData", "ajax_id=" + req.headers.ajax_id);
        //logit("getLinkData", "link_id=" + req.headers.link_id + " my_name="  + req.headers.my_name + " data={" + data + "}");
        res.type('application/json');
        res.send(json_str);
    };

    this.putLinkData = function (req, res) {
        this.debug(false, "putLinkData", "(" + req.headers.link_id + "," + req.headers.session_id + ") my_name=" + req.headers.my_name + "=>" + req.headers.his_name);

        var my_link = this.getLink(req, res);
        if (!my_link) {
            return;
        }
        my_link.resetKeepAliveTimer();

        var his_link = this.linkMgrObject().searchLink(req.headers.his_name, 0);
        if (!his_link) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            return;
        }

        var data = "hello put link data";
        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: data,
                    });

        this.debug(false, "putLinkData", "ajax_id=" + req.headers.ajax_id);
        //logit("putLinkData", "link_id=" + req.headers.link_id + " my_name="  + req.headers.my_name + " data={" + data + "}");
        res.type('application/json');
        res.send(json_str);
    };

    this.getNameList = function (req, res) {
        var link = this.getLink(req, res);
        if (!link) {
            return;
        }
        link.resetKeepAliveTimer();

        var name_array = this.linkMgrObject().getNameList();
        var name_array_str = JSON.stringify(name_array);
        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: name_array_str,
                    });
        res.send(json_str);
        this.debug(true, "getNameList", "(" + link.link_id + ",0) " + req.headers.my_name + "=>server " + name_array_str);
    };

    this.setupSession = function (req, res) {
        var session = this.sessionMgrObject().searchIt(req.headers.my_name, req.headers.his_name, Number(req.headers.link_id));
        if (!session){
            session = this.sessionMgrObject().searchAndCreate(req.headers.my_name, req.headers.his_name, 0);
            if (!session) {
                res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
                this.abend("setupSession", "null session");
                return;
            }
        }

        var session_id_str = "" + session.sessionId();
        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: session_id_str,
                    });
        res.send(json_str);
        this.logit("setupSession", "(" + req.headers.link_id + "," + session.sessionId() + "," + session.hisSession().sessionId() + ") " + req.headers.my_name + "=>" + req.headers.his_name);
    };

    this.getSessionData = function (req, res) {
        this.debug(false, "getSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") my_name=" + req.headers.my_name + "=>" + req.headers.his_name);
        var link = this.getLink(req, res);
        if (!link) {
            return;
        }
        link.resetKeepAliveTimer();

        var session = this.sessionMgrObject().searchIt(req.headers.my_name, req.headers.his_name, Number(req.headers.session_id));
        if (!session) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("getSessionData", "null session");
            return;
        }

        if (queue.queue_size(session.receiveQueue()) === 0) {
            this.debug(false, "getSessionData", "empty queue");
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            return;
        }

        //logit("getSessionData", "queue_size=" + queue.queue_size(session.receiveQueue));
        var data = queue.dequeue(session.receiveQueue());
        var data1 = ring.dequeue(session.receiveRing());
        if (data !== data1) {
            this.logit("*****Abend: getSessionData", "queue and ring not match");
        }
        if (!data) {
            this.debug(false, "getSessionData", "null data");
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            return;
        }

        var json_str = JSON.stringify({
                        command: req.headers.command,
                        ajax_id: req.headers.ajax_id,
                        data: data,
                    });

        this.debug(false, "getSessionData", "ajax_id=" + req.headers.ajax_id);
        this.logit("getSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.his_name + "=>" + req.headers.my_name + " {" + data + "}");
        res.type('application/json');
        res.send(json_str);
    };

    this.putSessionData = function (req, res) {
        //console.log(req.headers);
        this.debug(false, "putSessionData ", "ajax_id=" + req.headers.ajax_id);
        this.debug(false, "putSessionData ", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.his_name + "=>" + req.headers.my_name + " {" + req.headers.data + "}");

        var session_id = Number(req.headers.session_id);
        var xmt_seq = Number(req.headers.xmt_seq);
        var his_session;

        var link = this.getLink(req, res);
        if (!link) {
            return;
        }
        link.resetKeepAliveTimer();

        var session = this.sessionMgrObject().searchIt(req.headers.my_name, req.headers.his_name, Number(req.headers.session_id));
        if (!session) {
            res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
            this.abend("putSessionData", "null session");
            return;
        }

        this.logit("putSessionData", "(" + req.headers.link_id + "," + req.headers.session_id + ") "  + req.headers.my_name + "=>" + req.headers.his_name + " {" + req.headers.data + "} " + req.headers.xmt_seq + "=>" + session.up_seq);

        if (req.headers.my_name === req.headers.his_name) {
            his_session = session;
        } else {
            var his_session = this.sessionMgrObject().searchIt(req.headers.his_name, req.headers.my_name, Number(req.headers.session_id));
            if (!his_session) {
                res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
                this.abend("putSessionData", "null session");
                return;
            }
        }

        if (xmt_seq === session.up_seq) {
            queue.enqueue(his_session.receiveQueue(), req.headers.data);
            ring.enqueue(his_session.receiveRing(), req.headers.data);
            session.up_seq += 1;
        } else if (xmt_seq < session.up_seq) {
            if (xmt_seq === 0) {
                queue.enqueue(his_session.receiveQueue(), req.headers.data);
                ring.enqueue(his_session.receiveRing(), req.headers.data);
                session.up_seq = 1;
                this.logit("putSessionData", req.headers.data + " post " + xmt_seq + " reset");
            } else {
                this.logit("putSessionData", "(" + link_id + "," + session_id + ") "  + req.headers.my_name + "=>" + req.headers.his_name + " {" + req.headers.data + "} " + xmt_seq + " dropped");
            }
        } else {
            this.logit("***abend: putSessionData", req.headers.data + " post seq=" + xmt_seq + " dropped");
        }

        //logit("putSessionData", "queue_size=" + queue.queue_size(session.receiveQueue));
        res.send(this.jsonStingifyData(req.headers.command, req.headers.ajax_id, null));
    };

    this.processNotFound = function (req, res) {
        console.log(req.headers);
        this.logit("processNotFound", "*****");
        res.type('text/plain');
        res.status(404);
        res.send('Not Found');
    };

    this.processFailure = function (err, req, res, next) {
        this.logit("processFailure", state);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
}
