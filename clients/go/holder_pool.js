/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_pool.js
 */

function HolderPoolObject(util_val) {
    "use strict";
    this.theObjectName = "HolderPoolObject";
    This.this.theUtilObject = util_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.head = function () {
        return this.theHead;
    };

    this.tail = function () {
        return this.theTail;
    };

    this.mallocEntry = function (data_val) {
        var entry;

        this.abendIt("mallocEntry start");

        if (!head) {
            entry = holder_entry.malloc();
        } else {
            entry = head;
            head = entry.next;
            size -= 1;
        }

        this.abendIt("mallocEntry end");

        if (entry) {
            entry.data = data_val;
        } else {
            abend('mallocEntry', 'null');
        }

        return entry;
    };

    this.freeEntry = function(entry_val) {
        this.abendIt("freeEntry start");

        if (!entry_val) {
            return;
        }

        abendIt("freeEntry 1000");

        size += 1;
        entry_val.next = head;
        head = entry_val;

        this.abendIt("freeEntry end " + size);
    };

    this.abendIt = function (val) {
        var i, p;

        i = 0;
        p = head;
        while (p) {
            p = p.next;
            i += 1;
        }
        if (i !== size) {
            abend("abendIt", val + "size=" + size + " i=" + i);
        }

        if (size > 5) {
            abend("abendIt", val + " size=" + size);
        }
    };

    this.logit = function (s1_val, s2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, s2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theHead = null;
    this.theSize = 0;
}

module.exports = {
    malloc: function (data_val) {
         return mallocEntry(data_val);
    },

    free: function (entry_val) {
        freeEntry(entry_val);
    },
};

var util = require("./util_module.js");
var holder_entry = require("./holder_entry_module.js");



function abend (str1_val, str2_val) {
    "use strict";
    util.abend("HolderPoolModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("HolderPoolModule." + str1_val, str2_val);
}

S