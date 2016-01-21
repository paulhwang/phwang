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
    this.theUtilModule = require("./util_module.js");
    this.theSessionModule = require("./session_entry_module.js");
    this.thePoolHead = null;
    this.thePoolSize = 0;

    this.objectName = function () {
        return "SessionPoolObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.sessionModule = function () {
        return this.theSessionModule;
    };

    this.poolHead = function () {
        return this.thePoolHead;
    };

    this.setHead = function (val) {
        this.thePoolHead = val;
    };

    this.poolSize = function () {
        return this.thePoolSize;
    };

    this.incrementPoolSize = function () {
        return this.thePoolSize += 1;
    };

    this.decrementPoolSize = function () {
        return this.thePoolSize -= 1;
    };

    this.mallocIt = function (my_name_val, his_name_val) {
        var entry;

        if (!this.poolHead()) {
            entry = this.sessionModule().malloc(my_name_val, his_name_val);
        } else {
            entry = this.poolHead();
            this.sessionModule().reset(entry, my_name_val, his_name_val);
            this.setHead(entry.next);
            this.decrementPoolSize();
        }

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        this.incrementPoolSize();
        entry_val.next = this.poolHead();
        this.setHead(entry_val);
        this.abendIt();
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.poolHead();
        while (p) {
            p = p.next;
            i += 1;
        }
        if (i !== this.poolSize()) {
            this.abend("abendIt", "size=" + this.poolSize() + " i=" + i);
        }

        if (this.poolSize() > 5) {
            this.abend("abendIt", "size=" + this.poolSize());
        }
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };
}
