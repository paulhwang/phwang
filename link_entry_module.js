/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_entry_module.js
 */

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var global_link_id = 1;

module.exports = {
    reset: function (link_val, my_name_val) {
        resetIt(link_val, my_name_val);
   },

    malloc: function (my_name_val) {
        link = new LinkEntryObject();
        resetIt(link, my_name_val);
        return link;
    },

    keep_alive: function (link_val) {
        keepAlive(link_val);
    },
};

function resetIt (link_val, my_name_val) {
    link_val.my_name = my_name_val;
    link_val.up_seq = 0;
    link_val.down_seq = 0;
    link_val.queue = queue.malloc();
    link_val.ring = ring.malloc();
    link_val.link_id = global_link_id;
    global_link_id += 1;
    link_val.keep_alive_timer = resetTimeout(link_val);
}

function resetTimeout (link_val) {
    if (link_val.keep_alive_timer) {
        clearInterval(link_val.keep_alive_timer);
    }
    logit("resetTimeout", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
    var time_out = setInterval(function () {
        console.log("===in time out");
    }, 20000);
    return time_out;
}

function keepAlive (link_val) {
    //logit("keepAlive", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
    link_val.keep_alive_timer = resetTimeout(link_val);
}

function LinkEntryObject () {
}

function debug (debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function logit (str1_val, str2_val) {
    return util.utilLogit("NodeMain." + str1_val, str2_val);
}

function abend (str1_val, str2_val) {
    return util.utilAbend("NodeMain." + str1_val, str2_val);
}
