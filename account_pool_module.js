/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: account_pool_module.js
 */

module.exports = {
    malloc: function (his_name_val, my_name_val) {
         return mallocIt(his_name_val, my_name_val);
    },

    free: function (entry_val) {
        freeIt(entry_val);
    },
};

var util = require("./util_module.js");
var account = require("./account_entry_module.js");
var head = null;
var size = 0;

function mallocIt(his_name_val, my_name_val) {
    "use strict";
    var entry;

    if (!head) {
        entry = account.malloc(his_name_val, my_name_val);
    } else {
        entry = head;
        account.reset(entry, his_name_val, my_name_val);
        head = entry.next;
        size -= 1;
    }

    abendIt();
    return entry;
}

function freeIt(entry_val) {
    "use strict";

    size += 1;
    entry_val.next = head;
    head = entry_val;
    abendIt();
}

function abendIt() {
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
        abend("abendIt", "size=" + size + " i=" + i);
    }

    if (size > 5) {
         abend("abendIt", "size=" + size);
    }

    //logit('abendIt', 'succeed');
 }

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("AccountPoolModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("AccountPoolModule." + str1_val, str2_val);
}

