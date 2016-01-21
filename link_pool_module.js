/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_pool_module.js
 */

module.exports = {
    malloc: function (my_name_val) {
        return theLinkPoolObject.mallocIt(my_name_val);
    },

    free: function (entry_val) {
        theLinkPoolObject.freeIt(entry_val);
    },
};

var theLinkPoolObject = new LinkPoolObject();

var util = require("./util_module.js");
var link = require("./link_entry_module.js");
var head = null;
var size = 0;

function LinkPoolObject() {
    "use strict";

    this.objectName = function () {
        return "LinkPoolObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.mallocIt = function (my_name_val) {
        var entry;
        if (!head) {
            entry = link.malloc(my_name_val);
        } else {
            entry = head;
            link.reset(entry, my_name_val);
            head = entry.next;
            size -= 1;
        }

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        size += 1;
        entry_val.next = head;
        head = entry_val;
        this.abendIt();
    };

    this.abendIt = function () {
        var i, p;

        i = 0;
        p = head;
        while (p) {
            p = p.next;
            i += 1;
        }
        if (i !== size) {
            this.abend("abendIt", "size=" + size + " i=" + i);
        }

        if (size > 5) {
            this.abend("abendIt", "size=" + size);
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
}

