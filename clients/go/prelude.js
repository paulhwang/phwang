/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: prelude.js
 */

function PreludeObject(util_val) {
    "use strict";
    this.theUtilObject = util_val;

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.languageUsed = function () {
        return this.theLanguageUsed;
    };

    this.myName = function () {
        return this.theMyName;
    };

    this.myName2 = function () {
        return this.theMyName2;
    };

    this.setMyName = function (val) {
        this.theMyName = val;
    };

    this.setLanguageUsed = function (val) {
        this.theLanguageUsed = val;
    };

    this.theMyName = "dummy";
    this.theMyName2 = "";
    this.theLanguageUsed = "English";
}
