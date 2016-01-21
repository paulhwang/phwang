/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_entry_module.js
 */

module.exports = {
    malloc: function () {
        var entry = new HolderEntryObject();
        return entry;
    },
};

function HolderEntryObject() {
    "use strict";

    this.data = function () {
        return this.theData;
    };

    this.setData = function (val) {
        this.theData = val;
    };

    this.prev = function () {
        return this.thePrev;
    };

    this.setPrev = function (val) {
        this.thePrev = val;
    };

    this.next = function () {
        return this.theNext;
    };

    this.setNext = function (val) {
        this.theNext = val;
    };

    this.theData = null;
    this.thePrev = null;
    this.theNext = null;
}
