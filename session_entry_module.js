/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_entry_module.js
 */

module.exports = {
    malloc: function (session_mgr_val, my_name_val, his_name_val, session_id_val, topic_val) {
        session = new SessionEntryObject();
        session.resetIt(session_mgr_val, my_name_val, his_name_val, session_id_val, topic_val);
        return session;
    },
};

function SessionEntryObject() {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theRingModule = require("./ring_module.js");
    this.theTopicModule = require("./topic_module.js");

    this.objectName = function () {
        return "SessionEntryObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.ringModule = function () {
        return this.theRingModule;
    };

    this.topicModule = function () {
        return this.theTopicModule;
    };

    this.topicObject = function () {
        return this.theTopicObject;
    };

    this.sessionId = function () {
        return this.theSessionId;
    };

    this.setSessionId = function (val) {
        this.theSessionId = val;
    };

    this.myName = function () {
        return this.theMyName;
    };

    this.setMyName = function (val) {
        this.theMyName = val;
    };

    this.hisName = function () {
        return this.theHisName;
    };

    this.setHisName = function (val) {
        this.theHisName = val;
    };

    this.hisSession = function () {
        return this.theHisSession;
    };

    this.setHisSession = function (val) {
        this.theHisSession = val;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.receiveRing = function () {
        return this.theReceiveRing;
    };

    this.topicObject = function () {
        return this.theTopicObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.resetIt = function (session_mgr_val, my_name_val, his_name_val, session_id_val, topic_val) {
        this.theSessionMgrObject = session_mgr_val;
        this.theSessionId = session_id_val;
        this.theMyName = my_name_val;
        this.theHisName = his_name_val;
        this.theHisSession = null;
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.queueModule().malloc();
        this.theTransmitQueue = this.queueModule().malloc();
        this.theReceiveRing = this.ringModule().malloc();
        this.theTopicObject = topic_val;
        this.topicObject().addAdditionalSession(this);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().utilAbend(this.sessionId() + " " + this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().utilLogit(this.sessionId() + " " + this.objectName() + "." + str1_val, str2_val);
    };

    this.enqueueTransmitData = function (data_val) {
        this.debug(true, "enqueueTransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
    };

    this.dequeueTransmitData = function () {
        var data = this.transmitQueue().deQueue();
        this.debug(false, "dequeueTransmitData", data);
        return data;
    };

    this.enqueueReceiveData = function (data_val) {
        this.debug(true, "enqueueReceiveData", data_val);
        this.receiveQueue().enQueue(data_val);
        this.receiveRing().enQueue(data_val);
    };

    this.dequeueReceiveData = function () {
        var data = this.receiveQueue().deQueue();
        this.debug(true, "dequeueReceiveData", data);

        var data1 = this.receiveRing().deQueue();
        if (data !== data1) {
            this.abend("dequeueReceiveData", "queue and ring not match");
        }

        return data;
    };
}
