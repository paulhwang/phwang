/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionObject.js
 */

function SessionObject(root_object_val, receive_func_val, target_receive_val) {
    "use strict";
    this.theObjectName = "SessionObject";
    this.theRootObject = root_object_val;
    this.theReceiveFunction = receive_func_val;
    this.theTargetReceiveObject = target_receive_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.receiveFunction = function() {
        return this.theReceiveFunction;
    };

    this.targetReceiveObject = function () {
        return this.theTargetReceiveObject;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
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

    this.theReceiveQueue = new QueueObject(this.utilObject());
    this.theTransmitQueue = new QueueObject(this.utilObject());
}

