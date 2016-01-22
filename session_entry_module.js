/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_entry_module.js
 */

module.exports = {
    malloc: function (my_name_val, his_name_val, session_id_val) {
        session = new SessionEntryObject();
        session.resetIt(my_name_val, his_name_val, session_id_val);
        return session;
    },
};

function SessionEntryObject() {
    "use strict";
    this.theQueueModule = require("./queue_module.js");
    this.theRingModule = require("./ring_module.js");

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

    this.receiveRing = function () {
        return this.theReceiveRing;
    };

    this.resetIt = function (my_name_val, his_name_val, session_id_val) {
        this.theMyName = my_name_val;
        this.theHisName = his_name_val;
        this.theHisSession = null;
        this.up_seq = 0;
        this.down_seq = 0;
        this.theReceiveQueue = this.queueModule().malloc();
        this.theReceiveRing = this.ringModule().malloc();
        this.session_id = session_id_val;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };
}
