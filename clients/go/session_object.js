/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionObject.js
 */

function SessionObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "SessionObject";
    };

    this.setHisName = function (val) {
        this.theHisName = val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.ajaxObject = function () {
        return this.rootObject().ajaxObject();
    };

    this.clientReceiveCallbackFunc = function() {
        return this.theClientReceiveCallbackFunc;
    };

    this.clientObject = function () {
        return this.theClientObject;
    };

    this.myName = function () {
        return this.rootObject().myName();
    };

    this.hisName = function () {
        return this.theHisName;
    };

    this.gameName = function () {
        return this.theGameName;
    };

    this.setGameName = function (val) {
        this.theGameName = val;
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

    this.setupClientReceiveCallback = function (callback_func_val, client_val) {
        this.theClientReceiveCallbackFunc = callback_func_val;
        this.theClientObject = client_val;
    };

    this.receiveData = function (str_val) {
        this.clientReceiveCallbackFunc()(this.clientObject(), str_val);
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.transmitData = function () {
        var str;
        while (this.transmitQueue().size() > 0) {
            str = this.transmitQueue().deQueue();
            if (str) {
                //this.logit("transmitData", str);
                this.ajaxObject().postRequest(str, this);
                this.ajaxObject().sendDataToPeer(this, this);
            }
            else {
                this.abend("transmitData", "null data");
            }
        }
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilabend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theXmtSeq = 0;
    this.theRcvSeq = 0;
    this.theSessionId = 0;
    //this.theReceiveQueue = new QueueObject(this.utilObject());
    this.theTransmitQueue = new QueueObject(this.utilObject());
    this.rootObject().sessionMgrObject().enQueue(this);
}

