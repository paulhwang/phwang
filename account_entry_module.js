/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: account_entry_module.js
 */

var queue = require("./queue_module.js");

module.exports = {
    reset: function (acc_val, my_name_val, his_name_val) {
        resetIt(acc_val, my_name_val, his_name_val);
   },

    malloc: function (my_name_val, his_name_val) {
        acc = new AccountEntryObject();
        resetIt(acc, my_name_val, his_name_val);
        return acc;
    },
};

function resetIt (acc_val, my_name_val, his_name_val) {
    acc_val.my_name = my_name_val;
    acc_val.his_name = his_name_val;
    acc_val.up_seq = 0;
    acc_val.down_seq = 0;
    acc_val.queue = queue.malloc();
}

function AccountEntryObject() {
    "use strict";

    var name;
    var up_seq;
    var down_seq;
    var queue;
}
