/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    object: function () {
        return theRootObject;
    },
};

var theRootObject = new RootObject();

function RootObject () {
    "use strict";

    this.objectName = function () {
        return "RootObject";
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.linkMgrObject = function () {
        return this.theLinkMgrObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theUtilObject = require("./util_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theLinkMgrObject = require("./link_mgr_module.js");
    this.theSessionMgrObject = require("./session_mgr_module.js");
    this.linkMgrObject().init(this);
    this.sessionMgrObject().init(this);
}