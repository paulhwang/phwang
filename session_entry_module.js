/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_entry_module.js
 */

module.exports = {
    //reset: function (session_val, my_name_val, his_name_val) {
   //     session_val.resetIt(my_name_val, his_name_val);
   //},

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

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.receiveRing = function () {
        return this.theReceiveRing;
    };

    this.resetIt = function (my_name_val, his_name_val, session_id_val) {
        this.my_name = my_name_val;
        this.his_name = his_name_val;
        this.his_session = null;
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
