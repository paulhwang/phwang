/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

module.exports = {
    search: function (my_name_val, link_id_val) {
        return searchIt(my_name_val, link_id_val);
    },

    search_and_create: function (my_name_val, link_id_val) {
        return searchAndCreate(my_name_val, link_id_val);
    },

    get_name_list: function () {
        return getNameList();
    },

    malloc: function (my_name_val) {
         return mallocIt(my_name_val);
    },

    free: function (entry_val) {
        freeIt(entry_val);
    },
};

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var link_pool = require("./link_pool_module.js");

var link_queue = queue.malloc();

function searchIt(my_name_val, link_id_val) {
    debug(false, "searchIt", my_name_val + " " + link_id_val);
    return queue.search(link_queue, compareIt, my_name_val, link_id_val);
}

function searchAndCreate(my_name_val, link_id_val) {
    var link = queue.search(link_queue, compareIt, my_name_val, link_id_val);
    if (!link) {
        link = link_pool.malloc(my_name_val);
        debug(false, "searchAndCreate", "malloc link: name=" + link.my_name + "=link_id=" + link.link_id);
        queue.enqueue(link_queue, link);
    }
    return link;
}

function compareIt (link_val, my_name_val, link_id_val) {
    debug(false, "compareIt", my_name_val + ":" + link_val.my_name);
    if (my_name_val !== link_val.my_name) {
        return false;
    }
    if (link_id_val === -1) {
        return true;
    } else {
        return (link_id_val === link_val.link_id);
    }
}

function getNameList () {
    return "hello";
}

function mallocIt(my_name_val) {
    "use strict";
    var acc = link_pool.malloc(my_name_val);
    return acc;
}

function freeIt(entry_val) {
    "use strict";
}

function abendIt() {
}

function debug(debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function abend (str1_val, str2_val) {
    util.utilAbend("LinkMgrModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    util.utilLogit("LinkMgrModule." + str1_val, str2_val);
}

