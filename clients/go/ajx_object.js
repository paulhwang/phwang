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

    this.setupLink = function (request_val, session_val) {
        var this0 = this;
        var request0 = request_val;

        this.logit("setupLinkf", session_val.myName());
        request_val.open("GET", this.ajxRoute(), false);
        request_val.setRequestHeader("Content-Type", this.jsonContext());
        request_val.setRequestHeader("setup_link", "yes");
        request_val.setRequestHeader("my_name", session_val.myName());
        request_val.setRequestHeader("his_name", session_val.hisName());

        request_val.onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                var link_id = request0.responseText;
                this0.logit("getMessage", "link_id= " + request0.responseText);
                session_val.setLinkId(Number(link_id));
                //this0.logit("getMessage", "link_id= " + session_val.linkId());
            }
            else {
                //this0.logit("getMessage", "error=" + request0.readyState + ", " + request0.status);
            }
        };
        request_val.send(null);
    };


    this.setupSession = function (request_val, session_val) {
        var this0 = this;
        var request0 = request_val;

        this.logit("setupLinkf", session_val.myName());
        request_val.open("GET", this.ajxRoute(), false);
        request_val.setRequestHeader("Content-Type", this.jsonContext());
        request_val.setRequestHeader("setup_session", "yes");
        request_val.setRequestHeader("my_name", session_val.myName());
        request_val.setRequestHeader("his_name", session_val.hisName());

        request_val.onreadystatechange = function() {
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
        request_val.send(null);
    };

    this.getMessage = function (request_val, sesson_mgr_val, session_val) {
        var this0 = this;
        var request0 = request_val;

        request_val.open("GET", this.ajxRoute(), true);
        request_val.setRequestHeader("Content-Type", this.jsonContext());
        request_val.setRequestHeader("my_name", session_val.myName());
        request_val.setRequestHeader("his_name", session_val.hisName());
        request_val.setRequestHeader("link_id", this.rootObject().linkId());
        request_val.setRequestHeader("session_id", session_val.sessionId());

        request_val.onreadystatechange = function() {
            if ((request0.readyState === 4) && (request0.status === 200)) {
                var context_type = request0.getResponseHeader("Content-Type");
                this0.logit("getMessage", "data= " + request0.responseText);
                sesson_mgr_val.receiveStringData(request0.responseText);
                //func_val(request0.responseText);
            }
            else {
                //this0.logit("getMessage", "error=" + request0.readyState + ", " + request0.status);
            }
        };
        request_val.send(null);
    };

    this.postMessage = function (request_val, context_val, msg_val, session_val) {
        request_val.open("POST", this.ajxRoute(), true);
        request_val.setRequestHeader("Content-Type", this.jsonContext());

        if (context_val === this.jsonContext()) {
            var json_str = this.formJsonString(msg_val, session_val);
            this.logit("postMessage", "json=" + json_str);
            request_val.send(json_str);
        } else {
            request_val.send(msg_val);
        }

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
}

