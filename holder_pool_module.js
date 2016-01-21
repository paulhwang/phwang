/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_pool_module.js
 */

module.exports = {
    malloc: function (data_val) {
         return theHolderPoolObject.mallocEntry(data_val);
    },

    free: function (entry_val) {
        theHolderPoolObject.freeEntry(entry_val);
    },
};



var theHolderPoolObject = new HolderPoolObject();

function HolderPoolObject () {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theHolderEntryModule = require("./holder_entry_module.js");
    this.theHead = null;
    this.theSize = 0;

    this.objectName = function () {
        return "HolderPoolObject";
    };

    this.utilModule = function () {
        return this.theUtilModile;
    };

    this.holderEntryModule = function () {
        return this.theHolderEntryModule;
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
        this.theSize += 1;
    };

    this.decrementSize = function () {
        this.theSize -= 1;
    };

    this.mallocEntry = function (data_val) {
        var entry;

        this.abendIt();

        if (!this.head()) {
            entry = this.holderEntryModule().malloc();
        } else {
            entry = this.head();
            this.setHead(entry.next);
            this.decrementSize();
        }

        this.abendIt();

        if (entry) {
            entry.data = data_val;
        } else {
            this.abend('mallocEntry', 'null');
        }

        return entry;
    };

    this.freeEntry = function (entry_val) {
        this.abendIt();
        if (!entry_val) {
            return;
        }

        this.abendIt();
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
            this.abend("abendIt", " size=" + this.size());
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
