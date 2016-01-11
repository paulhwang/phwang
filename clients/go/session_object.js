/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionObject.js
 */

function SessionObject(root_object_val, target_receive_val, my_name_val, his_name_val) {
    "use strict";
    this.theObjectName = "SessionObject";
    this.theRootObject = root_object_val;
    this.theTargetReceiveObject = target_receive_val;
    this.theMyName = my_name_val;
    this.theHisName = his_name_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ajxObject = function () {
        return this.rootObject().ajxObject();
    };

    this.receiveFunction = function() {
        return this.theReceiveFunction;
    };

    this.targetReceiveObject = function () {
        return this.theTargetReceiveObject;
    };

    this.myName = function () {
        return this.theMyName;
    };

    this.hisName = function () {
        return this.theHisName;
    };

    this.xmtSeq = function () {
        return this.theXmtSeq;
    };

    this.incrementXmtSeq = function () {
        this.theXmtSeq += 1;
    };

    this.rcvSeq = function () {
        return this.theRcvSeq;
    };

    this.incrementRcvSeq = function () {
        this.theRcvSeq += 1;
    };

    this.sessionId = function () {
        return this.theSessionId;
    };

    this.setSessionId = function (val) {
        this.theSessionId = val;
    };

    //this.receiveQueue = function () {
    //    return this.theReceiveQueue;
    //};

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.setupReceiveCallBack = function (receive_func_val) {
        this.theReceiveFunction = receive_func_val;
    };

    this.receiveData = function (str_val) {
        this.receiveFunction()(this.targetReceiveObject(), str_val);
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theXmtSeq = 0;
    this.theRcvSeq = 0;
    this.theSessionId = 0;
    //this.theReceiveQueue = new QueueObject(this.utilObject());
    this.theTransmitQueue = new QueueObject(this.utilObject());
    this.ajxObject().setupSession(this);
}

