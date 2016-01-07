/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: prelude.js
 */

function PreludeObject(root_val) {
    "use strict";
    this.theRootObject = root_val;

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
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
