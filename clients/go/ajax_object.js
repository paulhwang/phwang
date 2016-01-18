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
                var link_id = request0.responseText;
                this0.logit("setupLink", "link_id= " + request0.responseText);
                root0.setLinkId(Number(link_id));
                callback_func_val(callback_param_val);
            }
        };

        var header = [{type: "command", value: "setup_link"},
                      {type: "my_name", value: this.rootObject().myName()}];
        this.ajaxJob(header);
    };

    this.ajaxJob = function (header_val) {
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        var i = 0;
        while (i < header_val.length) {
            this.httpGetRequest().setRequestHeader(header_val[i].type, header_val[i].value);
            i += 1;
        }
        this.httpGetRequest().send(null);
    };

    this.sendKeepAlive = function (root_val) {
        //this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        //this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        //this.httpGetRequest().setRequestHeader("command", "keep_alive");
        //this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());
        //this.httpGetRequest().setRequestHeader("link_id", this.rootObject().linkId());

        //this.httpGetRequest().send(null);
        var header = [{type: "command", value: "keep_alive"},
                      {type: "my_name", value: this.rootObject().myName()},
                      {type: "link_id", value: this.rootObject().linkId()}];
        this.ajaxJob(header);
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
                this0.logit("getNameList", "name_list= " + request0.responseText);
                root0.setNameList(JSON.parse(request0.responseText));
                if (callback_func_val) {
                    callback_func_val(callback_param_val);
                }
            }
        };
        //this.httpGetRequest().send(null);
        var header = [{type: "command", value: "get_name_list"},
                      {type: "my_name", value: this.rootObject().myName()},
                      {type: "link_id", value: this.rootObject().linkId()}];
        this.ajaxJob(header);
    };

    this.getSessionData = function (callback_func_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        //this.logit("getSessionData", "my_name=" + this.rootObject().myName() + " link_id=" + this.rootObject().linkId() + " session_id=" + session_val.sessionId());
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "get_session_data");
        this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());
        this.httpGetRequest().setRequestHeader("his_name", session_val.hisName());
        this.httpGetRequest().setRequestHeader("link_id", this.rootObject().linkId());
        this.httpGetRequest().setRequestHeader("session_id", session_val.sessionId());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                this0.logit("getMessage", "data= " + request0.responseText);
                session_val.receiveData(request0.responseText);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.initiateSessionConnection = function (callback_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();

        this.logit("initiateSessionConnection", session_val.myName());
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "setup_session");
        this.httpGetRequest().setRequestHeader("link_id", session_val.rootObject().linkId());
        this.httpGetRequest().setRequestHeader("my_name", session_val.myName());
        this.httpGetRequest().setRequestHeader("his_name", session_val.hisName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var session_id = request0.responseText;
                this0.logit("initiateSessionConnection", "session_id= " + request0.responseText);
                session_val.setSessionId(Number(session_id));
                callback_val(session_val);
            }
        };
        this.httpGetRequest().send(null);
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

    this.theHttpGetRequest = new XMLHttpRequest();
    this.theHttpPostRequest = new XMLHttpRequest();
}

