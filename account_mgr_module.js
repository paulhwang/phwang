/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

module.exports = {
    search: function (name_val) {
        return searchIt(name_val);
    },

    malloc: function (name_val) {
         return mallocIt(name_val);
    },

    free: function (entry_val) {
        freeIt(entry_val);
    },
};

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var account_pool = require("./account_pool_module.js");
//var account = require("./account_entry_module.js");

var account_queue = queue.malloc();

function searchIt(my_name_val, his_name_val) {
    "use strict";
    var link = queue.search(account_queue, compareIt, my_name_val, his_name_val);
    if (!link) {
        link = account_pool.malloc(my_name_val, his_name_val);
        queue.enqueue(account_queue, link);
    }
    return link;
}

function compareIt (link_val, my_name_val, his_name_val) {
    //logit("compareIt", name_val + " " + link_val.name);
    return (my_name_val === link_val.my_name);
}

function mallocIt(name_val) {
    "use strict";
    var acc = account_pool.malloc(name_val);
    return acc;
}

function freeIt(entry_val) {
    "use strict";
}

function abendIt() {
    "use strict";

    //logit('abendIt', 'before');

    //logit('abendIt', 'succeed');
 }

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("AccountMgrModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("AccountMgrModule." + str1_val, str2_val);
}

