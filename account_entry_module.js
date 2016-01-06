/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: account_entry_module.js
 */

var queue = require("./queue_module.js");

module.exports = {
    reset: function (acc_val, name_val) {
        resetIt(acc_val, name_val);
   },

    malloc: function (name_val) {
        acc = new AccountEntryObject();
        resetIt(acc, name_val);
        return acc;
    },
};

function resetIt (acc_val, name_val) {
    acc_val.name = name_val;
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
