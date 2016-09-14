/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: AjaxObject.js
 */

function AjaxObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "AjaxObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajaxSetupLinkCommand = function () {
        return "setup_link";
    };

    this.ajaxGetLinkDataCommand = function () {
        return "get_link_data";
    };

    this.ajaxPutLinkDataCommand = function () {
        return "put_link_data";
    };

    this.ajaxKeepAliveCommand = function () {
        return "keep_alive";
    };

    this.ajaxGetNameListCommand = function () {
        return "get_name_list";
    };

    this.ajaxSetupSessionCommand = function () {
        return "setup_session";
    };

    this.ajaxSetupSessionReplyCommand = function () {
        return "setup_session_reply";
    };

    this.ajaxGetSessionDataCommand = function () {
        return "get_session_data";
    };

    this.ajaxPutSessionDataCommand = function () {
        return "put_session_data";
    };

    this.callbackIndex = function () {
        return this.theCallbackIndex;
    };

    this.incrementCallbackIndex = function () {
        return this.theCallbackIndex += 1;
    };

    this.oustandingRequestCount = function () {
        return this.theOustandingRequestCount;
    };

    this.incrementOustandingRequestCount = function () {
        this.theOustandingRequestCount += 1;
        if (this.theOustandingRequestCount !== 1) {
            this.abend("decrementOustandingRequestCount", "not 1");
        }
    };

    this.decrementOustandingRequestCount = function () {
        this.theOustandingRequestCount -= 1;
        if (this.theOustandingRequestCount !== 0) {
            this.abend("decrementOustandingRequestCount", "not 0");
        }
    };

    this.callbackArray = function () {
        return this.theCallbackArray;
    };

    this.callbackArrayElement = function (index_val) {
        return this.theCallbackArray[index_val];
    };

    this.setCallbackArrayElement = function (index_val, data_val) {
        this.theCallbackArray[index_val] = data_val;
    };

    this.ajaxRoute = function () {
        return "/go_msg";
    };

    this.jsonContext = function () {
        return "application/json; charset=utf-8";
    }
    this.plainTextContext = function () {
        return "text/plain; charset=utf-8";
    }

    this.httpGetRequest = function () {
        return this.theHttpGetRequest;
    };

    this.httpPostRequest = function () {
        return this.theHttpPostRequest;
    };

    this.packetId = function () {
        return this.thePacketId;
    };

    this.incrementPacketId = function () {
        this.thePacketId += 1;
    };

    this.formJsonString = function (msg_val, session_val) {
        var s = JSON.stringify({
            his_name: session_val.hisName(),
            my_name: session_val.myName(),
            data: msg_val,
            xmt_seq: session_val.xmtSeq(),
            link_id: this.rootObject().linkId(),
            session_id: session_val.sessionId(),
        });
        session_val.incrementXmtSeq();
        return s;
    };

    this.setupCallback = function (command_val, id_val, func_val, param_val1, param_val2, param_val3) {
        this.setCallbackArrayElement(this.callbackIndex(),
                                     {command: command_val,
                                      id: id_val,
                                      func: func_val,
                                      param1: param_val1,
                                      param2: param_val2,
                                      param3: param_val3});
        this.incrementCallbackIndex();
    };

    this.getCallbackInfo = function (command_val, ajax_id_val) {
        var i = 0;
        while (i < this.callbackArray().length) {
            if (this.callbackArrayElement(i).command === command_val) {
                //this.logit("getCallbackInfo", ajax_id_val + " " + this.callbackArrayElement(i).id);
                //if (!this.callbackArrayElement(i).id || this.callbackArrayElement(i).id === ajax_id_val) {
                    return this.callbackArrayElement(i);
                //}
            }
            i += 1;
        }
    }

    this.enqueueOutput = function (ajax_val) {
        this.outputQueue.enQueue(ajax_val);
    };

    this.ajaxJob = function (request_val) {
        if (this.oustandingRequestCount() > 0) {
            return;
        }

        if (this.outputQueue.size() === 0) {
            this.keepAlive();
        }

        var ajax = this.outputQueue.deQueue();
        var header = ajax.header;
        request_val.open("GET", this.ajaxRoute(), true);
        request_val.setRequestHeader("Content-Type", this.jsonContext());
        request_val.setRequestHeader("command", ajax.command);
        if ((ajax.command !== "keep_alive") && 
            (ajax.command !== "get_link_data") &&
            (ajax.command !== "get_name_list") &&
            (ajax.command !== "get_session_data")) {
            this.debug(false, "ajaxJob", "command=" + ajax.command);
        }
        var i = 0;
        while (i < header.length) {
            request_val.setRequestHeader(header[i].type, header[i].value);
            i += 1;
        }
        request_val.setRequestHeader("packet_id", this.packetId());
        this.incrementPacketId();

        request_val.send(null);
        this.incrementOustandingRequestCount();
    };

    this.waitOnreadyStateChange = function (request_val) {
        var this0 = this;
        request_val.onreadystatechange = function() {
            if ((request_val.readyState === 4) && (request_val.status === 200)) {
                this0.debug(false, "waitOnreadyStateChange", "json_str= " + request_val.responseText);
                var json = JSON.parse(request_val.responseText);
                if ((json.command !== "keep_alive") &&
                    (json.command !== "get_link_data") &&
                    (json.command !== "get_name_list") &&
                    (json.command !== "get_session_data")) {
                    this0.logit("waitOnreadyStateChange", "command=" + json.command + " ajax_id=" + json.ajax_id + " data=" + json.data);
                }
                var callback_info = this0.getCallbackInfo(json.command, json.ajax_id);
                if (callback_info) {
                    callback_info.func(json.data, json.res_data, callback_info.param1, callback_info.param2, callback_info.param3);
                }
                this0.decrementOustandingRequestCount();
                this0.ajaxJob(request_val);
            }
        };
    };

    this.startAjaxWork = function () {
        this.theHttpGetRequest = new XMLHttpRequest();
        this.waitOnreadyStateChange(this.httpGetRequest());
        this.ajaxJob(this.httpGetRequest());
    };

    this.setupLink = function (ajax_id_val) {
        this.logit("setupLink", this.rootObject().myName());
        var ajax = {
            command: this.ajaxSetupLinkCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()}]
            };
        this.enqueueOutput(ajax);
        this.startAjaxWork();
    };

    this.keepAlive = function (ajax_id_val) {
        var ajax = {
            command: this.ajaxKeepAliveCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()}]
            };
        this.enqueueOutput(ajax);
    };

    this.getLinkData = function (ajax_id_val) {
        this.debug(false, "getLinkData", "ajax_id=" + ajax_id_val + " LinkId=" + this.rootObject().linkId());
        var ajax = {
            command: this.ajaxGetLinkDataCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()}],
            };
        this.enqueueOutput(ajax);
    };

    this.getNameList = function (ajax_id_val) {
        var ajax = {
            command: this.ajaxGetNameListCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()}]
            };
        this.enqueueOutput(ajax);
    };

    this.setupSession = function (ajax_id_val, session_val, data_val) {
        this.logit("setupSession", session_val.myName());
        var ajax = {
            command: this.ajaxSetupSessionCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "his_name", value: session_val.hisName()},
                     {type: "data", value: data_val}],
            };
        this.enqueueOutput(ajax);
    };

    this.setupSessionReply = function (ajax_id_val, session_val, data_val) {
        this.logit("setupSessionReply", session_val.myName());
        var ajax = {
            command: this.ajaxSetupSessionReplyCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "his_name", value: session_val.hisName()},
                     {type: "data", value: data_val}],
            };
        this.enqueueOutput(ajax);
    };

    this.getSessionData = function (ajax_id_val, session_val) {
        this.debug(false, "getSessionData", "ajax_id=" + ajax_id_val + " sessionId=" + session_val.sessionId());
        var ajax = {
            command: this.ajaxGetSessionDataCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "session_id", value: session_val.sessionId()},
                     {type: "his_name", value: session_val.hisName()}],
            };
        this.enqueueOutput(ajax);
    };

    this.putSessionData = function (ajax_id_val, session_val, data_val) {
        this.logit("putSessionData", "ajax_id=" + ajax_id_val + " data=" + data_val);
        var ajax = {
            command: this.ajaxPutSessionDataCommand(),
            header: [{type: "ajax_id", value: ajax_id_val},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "session_id", value: session_val.sessionId()},
                     {type: "his_name", value: session_val.hisName()},
                     {type: "xmt_seq", value: session_val.xmtSeq()},
                     {type: "data", value: data_val}],
            };
        session_val.incrementXmtSeq();
        this.enqueueOutput(ajax);
    };

    this.postRequest___ = function (msg_val, session_val) {
        this.httpPostRequest().open("POST", this.ajaxRoute(), true);
        this.httpPostRequest().setRequestHeader("Content-Type", this.jsonContext());

        var json_str = this.formJsonString(msg_val, session_val);
        this.logit("postMessage", "json=" + json_str);
        this.httpPostRequest().send(json_str);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (!debug_val) {
            return;
        }
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, "==" + str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.thePacketId = 1;
    this.theOustandingRequestCount = 0;
    this.theCallbackIndex = 0;
    this.theCallbackArray = [];
    this.outputQueue = new QueueObject(this.utilObject());
    this.theHttpPostRequest = new XMLHttpRequest();
}

