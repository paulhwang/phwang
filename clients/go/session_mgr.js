/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionMgrObject.js
 */

function SessionMgrObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "SessionMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajxObject = function () {
        return this.rootObject().ajaxObject();
    };

    this.sessionQueue = function () {
        return this.theSessionQueue;
    };

    this.queueSize = function () {
        return this.sessionQueue().size();
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

    this.enQueueSessionData = function (session_val) {
        this.enQueue(session_val);
        this.transmitData();
    };

    this.transmitData = function () {
        var session, str;
        while (true) {
            session = this.rootObject().sessionMgrObject().deQueue();
            if (!session) {
                return;
            }
            str = session.transmitQueue().deQueue();
            if (str) {
                //this.logit("transmitData", str);
                this.ajxObject().postRequest(str, session);
                this.ajxObject().sendDataToPeer(this, session);
            }
            else {
                this.abend("transmitData", "null data");
            }
        }
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionQueue = new QueueObject(this.utilObject());
}

