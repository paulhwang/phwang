/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_topic_module.js
 */

module.exports = {
    malloc: function (session_val) {
        return new topicObject(session_val);
    },
};

function topicObject () {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theGoContainerModule = require("./go_game/go_container_module.js")

    this.objectName = function () {
        return "topicObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.goContainerModule = function () {
        return this.theGoContainerModule;
    };

    this.sessionObject = function () {
        return this.sessionArray(0);
    };

    this.goContainerObject = function () {
        return this.theGoContainerObject;
    };

    this.sessionArray = function (index_val) {
        return this.theSessionArray[index_val];
    };

    this.sessionArrayLength = function () {
        return this.theSessionArrayLength;
    };

    this.incrementSessionArrayLength = function () {
        this.theSessionArrayLength += 1;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.addAdditionalSession = function (session_val) {
        this.theSessionArray[this.sessionArrayLength()] = session_val;
        this.incrementSessionArrayLength();
    };

    this.enqueueTransmitData = function (data_val) {
        this.debug(true, "enqueueTransmitData", data_val);
        this.transmitQueue().enQueue(data_val);
    };

    this.processTransmitData = function () {
        while (true) {
            var data = this.transmitQueue().deQueue();
            if (!data) {
                return;
            }

            var i = 0;
            while (i < this.sessionArrayLength()) {
                this.sessionArray(i).enqueueTransmitData(data);
                i += 1;
            }
        }
    };

    this.processSetupLinkData = function (json_data_val) {
        this.debug(true, "processSetupLinkData", "data=" + json_data_val);
        var json = JSON.parse(json_data_val);
        if (json.command === "config") {
            this.goContainerObject().configObject().createConfig(json.data);
        }
    };

    this.processReceiveData = function () {
        while (true) {
            var data = this.receiveQueue().deQueue();
            if (!data) {
                return;
            }
            this.receiveStringData(data);
        }
    };

    this.enqueAndPocessReceiveData = function (data_val) {
        this.debug(true, "processReceiveData", data_val);
        this.receiveQueue().enQueue(data_val);
        this.processReceiveData();
    };

    this.receiveStringData = function (str_val) {
        this.goContainerObject().portObject().receiveStringData(str_val);
    };

    this.logit(this.objectName(), "aaa");

    this.theSessionArray = [2];
    this.theSessionArrayLength = 0;
    this.theGoContainerObject = this.goContainerModule().malloc(this);
    this.theReceiveQueue = this.queueModule().malloc();
    this.theTransmitQueue = this.queueModule().malloc();
}
