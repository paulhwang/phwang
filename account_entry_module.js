/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_entry_module.js
 */

var queue = require("./queue_module.js");
var ring = require("./ring_module.js");
var global_link_id = 1;

module.exports = {
    reset: function (link_val, my_name_val, his_name_val) {
        resetIt(link_val, my_name_val, his_name_val);
   },

    malloc: function (my_name_val, his_name_val) {
        link = new AccountEntryObject();
        resetIt(link, my_name_val, his_name_val);
        return link;
    },
};

function resetIt (link_val, my_name_val, his_name_val) {
    link_val.my_name = my_name_val;
    link_val.his_name = his_name_val;
    link_val.up_seq = 0;
    link_val.down_seq = 0;
    link_val.queue = queue.malloc();
    link_val.ring = ring.malloc();
    link_val.link_id = global_link_id;
    global_link_id += 1;
}

function AccountEntryObject() {
    "use strict";

    var my_name;
    var his_name;
    var up_seq;
    var down_seq;
    var queue;
    var ring;
    var link_id;
}
