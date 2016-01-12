/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: AjxObject.js
 */

function AjaxObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

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

    this.setupLink = function (callback_val, root_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        this.logit("setupLink", this.rootObject().myName());
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "setup_link");
        this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var link_id = request0.responseText;
                this0.logit("setupLink", "link_id= " + request0.responseText);
                root0.setLinkId(Number(link_id));
                callback_val(root_val);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.getNameList = function (callback_val, root_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();
        var root0 = this.rootObject();

        if (this.rootObject().nameListDone()) {
            return;
        }

        this.logit("getNameList", this.rootObject().myName());
        this.httpGetRequest().open("GET", this.ajaxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("command", "get_name_list");
        this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var link_id = request0.responseText;
                this0.logit("getNameList", "link_id= " + request0.responseText);
                root0.setLinkId(Number(link_id));
                callback_val(root_val);
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
        return this.utilObject().utilAbend("AjxObject." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit("AjxObject." + str1_val, str2_val);
    };

    this.theHttpGetRequest = new XMLHttpRequest();
    this.theHttpPostRequest = new XMLHttpRequest();
}
