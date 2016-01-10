/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_entry_module.js
 */

var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var global_session_id = 1;

module.exports = {
    reset: function (session_val, my_name_val, his_name_val) {
        resetIt(session_val, my_name_val, his_name_val);
   },

    malloc: function (my_name_val, his_name_val) {
        link = new SessionEntryObject();
        resetIt(link, my_name_val, his_name_val);
        return link;
    },
};

function resetIt (session_val, my_name_val, his_name_val) {
    session_val.my_name = my_name_val;
    session_val.his_name = his_name_val;
    session_val.up_seq = 0;
    session_val.down_seq = 0;
    session_val.queue = queue.malloc();
    session_val.ring = ring.malloc();
    session_val.session_id = global_session_id;
    global_session_id += 1;
}

function SessionEntryObject() {
}
