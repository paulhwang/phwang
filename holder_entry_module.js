/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_entry_module.js
 */

module.exports = {
    malloc: function () {
        var entry = new HolderEntryObject();
        data = null;
        prev = null;
        next = null;
        return entry;
    },
};

function HolderEntryObject() {
    "use strict";

    var data;
    var prev;
    var next;
}
