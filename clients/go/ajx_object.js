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

    this.jsonContext = function () {
        return "application/json; charset=utf-8";
    }
    this.plainTextContext = function () {
        return "text/plain; charset=utf-8";
    }

    this.ajaxSeqNumber = function () {
        return this.theAjaxSeqNumber;
    };

    this.incrementAjaxSeqNumber = function () {
        this.theAjaxSeqNumber += 1;
    };

    this.formJsonString = function (msg_val, session_val) {
        var s = JSON.stringify({
            his_name: session_val.hisName(),
            data: msg_val,
            xmt_seq: this.ajaxSeqNumber(),
        });
        this.incrementAjaxSeqNumber();
        return s;
    };

    this.getMessage = function (request_val, dir_val, context_val, sesson_mgr_val, session_val) {
        var this0 = this;
        var request0 = request_val;

        request_val.open("GET", dir_val);
        request_val.setRequestHeader("Content-Type", context_val);
        request_val.setRequestHeader("Name", session_val.myName());

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

    this.postMessage = function (request_val, dir_val, context_val, msg_val, session_val) {
        request_val.open("POST", dir_val);
        request_val.setRequestHeader("Content-Type", context_val);

        if (context_val === this.jsonContext()) {
            var json_str = this.formJsonString(msg_val, session_val);
            this.logit("postMessage", "dir=" + dir_val + " json=" + json_str);
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

    this.theAjaxSeqNumber = 0;
}

