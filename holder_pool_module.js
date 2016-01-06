/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_pool_module.js
 */

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
var head = null;
var size = 0;

function mallocEntry(data_val) {
    "use strict";
    var entry;

    abendIt("mallocEntry start");

    if (!head) {
        entry = holder_entry.malloc();
    } else {
        entry = head;
        head = entry.next;
        size -= 1;
    }

    abendIt("mallocEntry end");

    if (entry) {
        entry.data = data_val;
    } else {
        abend('mallocEntry', 'null');
    }

    return entry;
}

function freeEntry(entry_val) {
    "use strict";

    abendIt("freeEntry start");
    if (!entry_val) {
        return;
    }

    abendIt("freeEntry 1000");
    size += 1;
    entry_val.next = head;
    head = entry_val;

    abendIt("freeEntry end" + size);
    abendIt("freeEntry end");
}

function abendIt(val) {
    "use strict";
    var i, p;

    //logit('abendIt', 'before');

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

    //logit('abendIt', 'succeed');
 }

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("HolderPoolModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("HolderPoolModule." + str1_val, str2_val);
}

