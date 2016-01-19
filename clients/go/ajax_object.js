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

    this.callbackIndex = function () {
        return this.theCallbackIndex;
    };

    this.incrementCallbackIndex = function () {
        return this.theCallbackIndex += 1;
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

    this.getPendingData = function (callback_func_val, callback_param_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        //this.logit("getPendingData", this.rootObject().myName());
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "get_pending_data");
        this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                //this0.logit("getPendingData", request0.responseText);
                callback_func_val(callback_param_val);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.setupLink = function (callback_func_val, callback_param_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        this.logit("setupLink", this.rootObject().myName());
        //this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        //this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        //this.httpGetRequest().setRequestHeader("command", "setup_link");
        //this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var json = JSON.parse(request0.responseText);
                this0.logit("setupLink", "command=" + json.command + " ajax_id=" + json.ajax_id + " data=" + json.data);
                var link_id = json.data;
                this0.logit("setupLink", "link_id= " + json.data);
                root0.setLinkId(Number(link_id));
                callback_func_val(callback_param_val);
            }
        };

        var ajax = {
            command: "setup_link",
            callback_func: callback_func_val,
            callback_param: callback_param_val,
            header: [{type: "ajax_id", value: this.rootObject().myName()},
                     {type: "my_name", value: this.rootObject().myName()}]
            };
        this.enqueueOutput(ajax);
    };

    this.enqueueOutput = function (ajax_val) {
        this.outputQueue.enQueue(ajax_val);
        this.ajaxJob();
    };

    this.ajaxJob = function () {
        if (this.outputQueue.size() === 0) {
            this.sendKeepAlive();
        }
        while (this.outputQueue.size() > 0) {
            var ajax = this.outputQueue.deQueue();
            var header = ajax.header;
            this.httpGetRequest().open("GET", this.ajaxRoute(), true);
            this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
            this.httpGetRequest().setRequestHeader("command", ajax.command);
            var i = 0;
            while (i < header.length) {
                this.httpGetRequest().setRequestHeader(header[i].type, header[i].value);
                i += 1;
            }
            this.httpGetRequest().send(null);
        }
    };

    this.sendKeepAlive = function (root_val) {
        //this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        //this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        //this.httpGetRequest().setRequestHeader("command", "keep_alive");
        //this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());
        //this.httpGetRequest().setRequestHeader("link_id", this.rootObject().linkId());

        //this.httpGetRequest().send(null);
        var ajax = {
            command: "keep_alive",
            callback_func: null,
            callback_param: null,
            header: [{type: "ajax_id", value: this.rootObject().myName()},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()}]
            };
        this.enqueueOutput(ajax);
        /*
        var header = [{type: "command", value: "keep_alive"},
                      {type: "my_name", value: this.rootObject().myName()},
                      {type: "link_id", value: this.rootObject().linkId()}];
        this.enqueueOutput(header);
        */
    };

    this.getNameList = function (callback_func_val, callback_param_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

/*
        if (callback_param_val.objectName() === "SessionObject") {
            var his_name = $(".peer_name_paragraph select").val();
            if (his_name) {
                callback_param_val.setHisName(his_name);
                this.logit("getNameList" + "his_name=" + callback_param_val.hisName());
            }
        }
*/

        //this.logit("getNameList", "my_name=" + this.rootObject().myName());
        //this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        //this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        //this.httpGetRequest().setRequestHeader("command", "get_name_list");
        //this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());
        //this.httpGetRequest().setRequestHeader("link_id", this.rootObject().linkId());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var json = JSON.parse(request0.responseText);
                this0.logit("getSessionData", "command=" + json.command + " ajax_id=" + json.ajax_id + " data=" + json.data);
                this0.logit("getNameList", "name_list= " + json.data);
                //root0.setNameList(JSON.parse(json.data));
                if (callback_func_val) {
                    callback_func_val(json.data, callback_param_val);
                }
            }
        };
        //this.httpGetRequest().send(null);
        var ajax = {
            command: "get_name_list",
            callback_func: callback_func_val,
            callback_param: callback_param_val,
            header: [{type: "ajax_id", value: this.rootObject().linkId()},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()}]
            };
        this.enqueueOutput(ajax);
        /*
        var header = [{type: "command", value: "get_name_list"},
                      {type: "my_name", value: this.rootObject().myName()},
                      {type: "link_id", value: this.rootObject().linkId()}];
        this.enqueueOutput(header);
        */
    };

    this.getSessionData = function (callback_func_val, ajax_id_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        //this.logit("getSessionData", "ajax_id=", ajax_id_val);

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                this0.logit("getSessionData", "json_str= " + request0.responseText);
                var json = JSON.parse(request0.responseText);
                this0.logit("getSessionData", "command=" + json.command + " ajax_id=" + json.ajax_id + " data=" + json.data);
                var callback_info = this0.getCallbackInfo(json.command, json.ajax_id);
                if (callback_info) {
                    callback_info.func(json.data, callback_info.param1);
                }
            }
        };

        var ajax = {
            command: "get_session_data",
            callback_func: callback_func_val,
            callback_param: session_val,
            header: [{type: "ajax_id", value: session_val.sessionId()},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "session_id", value: session_val.sessionId()},
                     {type: "his_name", value: session_val.hisName()}],
            };
        this.enqueueOutput(ajax);
    };

    this.initiateSessionConnection = function (callback_func_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();

        this.logit("initiateSessionConnection", session_val.myName());
        //this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        //this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        //this.httpGetRequest().setRequestHeader("command", "setup_session");
        //this.httpGetRequest().setRequestHeader("link_id", session_val.rootObject().linkId());
        //this.httpGetRequest().setRequestHeader("my_name", session_val.myName());
        //this.httpGetRequest().setRequestHeader("his_name", session_val.hisName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var json = JSON.parse(request0.responseText);
                this0.logit("getSessionData", "command=" + json.command + " ajax_id=" + json.ajax_id + " data=" + json.data);
                var session_id = json.data;
                this0.logit("initiateSessionConnection", "session_id= " + json.data);
                session_val.setSessionId(Number(session_id));
                callback_func_val(session_val);
            }
        };
        //this.httpGetRequest().send(null);
        var ajax = {
            command: "setup_session",
            callback_func: callback_func_val,
            callback_param: session_val,
            header: [{type: "ajax_id", value: this.rootObject().linkId()},
                     {type: "my_name", value: this.rootObject().myName()},
                     {type: "link_id", value: this.rootObject().linkId()},
                     {type: "his_name", value: session_val.hisName()}],
            };
        this.enqueueOutput(ajax);
        /*
        var header = [{type: "command", value: "setup_session"},
                      {type: "my_name", value: this.rootObject().myName()},
                      {type: "his_name", value: session_val.hisName()},
                      {type: "link_id", value: this.rootObject().linkId()}];
        this.enqueueOutput(header);
        */
    };

    this.sendDataToPeer = function (sesson_mgr_val, session_val) {
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "peer");
        this.httpGetRequest().setRequestHeader("my_name", session_val.myName());
        this.httpGetRequest().setRequestHeader("his_name", session_val.hisName());
        this.httpGetRequest().setRequestHeader("link_id", this.rootObject().linkId());
        this.httpGetRequest().setRequestHeader("session_id", session_val.sessionId());

        this.getRequest(sesson_mgr_val, session_val);
    };

    this.getRequest = function (sesson_mgr_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                this0.logit("getMessage", "data= " + request0.responseText);
                session_val.receiveData(request0.responseText);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.postRequest = function (msg_val, session_val) {
        this.httpPostRequest().open("POST", this.ajaxRoute(), true);
        this.httpPostRequest().setRequestHeader("Content-Type", this.jsonContext());

        var json_str = this.formJsonString(msg_val, session_val);
        this.logit("postMessage", "json=" + json_str);
        this.httpPostRequest().send(json_str);

/*
        $.ajax({
            data: {data: msg_val},
            url: dir_val,
            type: 'post',
            dataType: 'json',

        });
*/
    };

    this.setupAjax = function () {
        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var link_id = request0.responseText;
                this0.logit("setupLink", "link_id= " + request0.responseText);
                root0.setLinkId(Number(link_id));
                callback_func_val(callback_param_val);
            }
        };
    };

    this.newHttpRequest = function () {
        var request = new XMLHttpRequest();
        return request;
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theCallbackIndex = 0;
    this.theCallbackArray = [];
    this.outputQueue = new QueueObject(this.utilObject());
    this.inputQueue = new QueueObject(this.utilObject());
    this.theHttpGetRequest = new XMLHttpRequest();
    this.setupAjax();
    this.theHttpPostRequest = new XMLHttpRequest();
}

