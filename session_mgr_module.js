/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_mgr_module.js
 */

module.exports = {
    search: function (my_name_val, his_name_val, session_id_val) {
        return searchIt(my_name_val, his_name_val, session_id_val);
    },

    search_and_create: function (my_name_val, his_name_val, session_id_val) {
        return searchAndCreate(my_name_val, his_name_val, session_id_val);
    },

    malloc: function (my_name_val, his_name_val) {
         return mallocIt(my_name_val, his_name_val);
    },

    free: function (entry_val) {
        freeIt(entry_val);
    },
};

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var session_pool = require("./session_pool_module.js");
var session_queue = queue.malloc();

function searchIt(my_name_val, his_name_val, session_id_val) {
    "use strict";
    return queue.search(session_queue, compareIt, my_name_val, his_name_val, session_id_val);
}

function searchAndCreate(my_name_val, his_name_val, session_id_val) {
    "use strict";
    var session = queue.search(session_queue, compareIt, my_name_val, his_name_val, session_id_val);
    if (!session) {
        session = session_pool.malloc(my_name_val, his_name_val);
        queue.enqueue(session_queue, session);
    }
    return session;
}

function compareIt (session_val, my_name_val, his_name_val, session_id_val) {
    //logit("compareIt", my_name_val + ":" + session_val.my_name + " " + his_name_val + ":" + session_val.his_name);
    //return (my_name_val === session_val.my_name);
    if ((my_name_val !== session_val.my_name) || (his_name_val !== session_val.his_name)) {
        return false;
    }
    if (session_id_val === -1) {
        return true;
    } else {
        return (session_id_val === session_val.session_id);
    }
}

function mallocIt(my_name_val, his_name_val) {
    "use strict";
    var acc = session_pool.malloc(my_name_val, his_name_val);
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
    "use strict";
    util.abend("SessionMgrModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("SessionMgrModule." + str1_val, str2_val);
}

