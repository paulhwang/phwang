/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionMgrObject.js
 */

function SessionMgrObject(root_object_val) {
    "use strict";
    this.theObjectName = "SessionMgrObject";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.sessionQueue = function () {
        return this.theSessionQueue;
    };

    this.enQueue = function (session_val) {
        if (!session_val) {
            this.abend("enQueue", "null input");
            return;
        }
        this.sessionQueue().enQueue(session_val);
    };

    this.deQueue = function () {
        var session = this.sessionQueue().deQueue();
        return session;
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionQueue = new QueueObject(this.utilObject());
}

