/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: AjxObject.js
 */

function AjxObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajxRoute = function () {
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
        this.httpGetRequest().open("GET", this.ajxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("setup_link", "yes");
        this.httpGetRequest().setRequestHeader("my_name", this.rootObject().myName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var link_id = request0.responseText;
                this0.logit("getMessage", "link_id= " + request0.responseText);
                root0.setLinkId(Number(link_id));
                callback_val(root_val);
            }
            else {
                //this0.logit("getMessage", "error=" + request0.readyState + ", " + request0.status);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.initiateSessionConnection = function (session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();

        this.logit("setupLinkf", session_val.myName());
        this.httpGetRequest().open("GET", this.ajxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("setup_session", "yes");
        this.httpGetRequest().setRequestHeader("my_name", session_val.myName());
        this.httpGetRequest().setRequestHeader("his_name", session_val.hisName());

        this.httpGetRequest().onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var session_id = request0.responseText;
                this0.logit("getMessage", "session_id= " + request0.responseText);
                session_val.setSessionId(Number(session_id));
                //this0.logit("getMessage", "session_id= " + session_val.linkId());
            }
            else {
                //this0.logit("getMessage", "error=" + request0.readyState + ", " + request0.status);
            }
        };
        this.httpGetRequest().send(null);
    };

    this.getMessage = function (sesson_mgr_val, session_val) {
        var this0 = this;
        var request0 = this.httpGetRequest();

        this.httpGetRequest().open("GET", this.ajxRoute(), true);
        this.httpGetRequest().setRequestHeader("Content-Type", this.jsonContext());
        this.httpGetRequest().setRequestHeader("my_name", session_val.myName());
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

    this.postMessage = function (msg_val, session_val) {
        this.httpPostRequest().open("POST", this.ajxRoute(), true);
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

