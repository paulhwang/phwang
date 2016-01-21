/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_pool_module.js
 */

module.exports = {
    malloc: function (my_name_val, his_name_val) {
         return theSessionPoolObject.mallocIt(my_name_val, his_name_val);
    },

    free: function (entry_val) {
        theSessionPoolObject.freeIt(entry_val);
    },
};

var theSessionPoolObject = new SessionPoolObject();

function SessionPoolObject() {
    "use strict";

    this.objectName = function () {
        return "SessionPoolObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.sessionModule = function () {
        return this.theSessionModule;
    };

    this.head = function () {
        return this.theHead;
    };

    this.setHead = function (val) {
        this.theHead = val;
    };

    this.size = function () {
        return this.theSize;
    };

    this.incrementSize = function () {
        return this.theSize += 1;
    };

    this.decrementSize = function () {
        return this.theSize -= 1;
    };

    this.mallocIt = function (my_name_val, his_name_val) {
        var entry;

        if (!this.head()) {
            entry = this.sessionModule().malloc(my_name_val, his_name_val);
        } else {
            entry = this.head();
            this.sessionModule().reset(entry, my_name_val, his_name_val);
            this.setHead(entry.next);
            this.decrementSize();
        }

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        this.incrementSize();
        entry_val.next = this.head();
        this.setHead(entry_val);
        this.abendIt();
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.head();
        while (p) {
            p = p.next;
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "size=" + this.size() + " i=" + i);
        }

        if (this.size() > 5) {
            this.abend("abendIt", "size=" + this.size());
        }
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

    this.theUtilModule = require("./util_module.js");
    this.theSessionModule = require("./session_entry_module.js");
    this.theHead = null;
    this.theSize = 0;
}
