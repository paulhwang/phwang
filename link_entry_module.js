/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_entry_module.js
 */

module.exports = {
    malloc: function (my_name_val, link_id_val) {
        link = new LinkEntryObject();
        link.resetIt(my_name_val, link_id_val);
        return link;
    },
};

function LinkEntryObject() {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theRingModule = require("./ring_module.js");
    this.theLinkMgrModule = require("./link_mgr_module.js");

    this.objectName = function () {
        return "LinkEntryObject";
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

    this.linkMgrModule = function () {
        return this.theLinkMgrModule;
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.receiveRing = function () {
        return this.theReceiveRing;
    };

    this.resetIt = function (my_name_val, link_id_val) {
        this.my_name = my_name_val;
        this.up_seq = 0;
        this.down_seq = 0;
        this.queue = this.queueModule().malloc();
        this.ring = this.ringModule().malloc();
        this.link_id = link_id_val;
        this.keep_alive_timer = this.resetTimeout();
    };

    this.resetKeepAliveTimer = function () {
        this.debug(false, "keepAlive", "my_name=" + this.my_name + " link_id=" + this.link_id);
        this.keep_alive_timer = this.resetTimeout();
    };

    this.resetTimeout = function () {
        if (this.keep_alive_timer) {
            clearInterval(this.keep_alive_timer);
        }
        this.debug(false, "resetTimeout", "my_name=" + this.my_name + " link_id=" + this.link_id);
        var time_out = setInterval(function (link_val) {
            console.log("resetTimeout(***timeout occurs)", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
            clearInterval(link_val.keep_alive_timer);
            link_val.linkMgrModule().remove_link(link_val);
        }, 20000, this);
        return time_out;
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
