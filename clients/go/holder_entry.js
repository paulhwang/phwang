/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_entry.js
 */

function HolderEntryObject() {
    "use strict";

    this.objectName = function () {
        return "HolderEntryObject";
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

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

    this.logit = function (s1_val, s2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, s2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theData = null;
    this.thePrev = null;
    this.theNext = null;
}
