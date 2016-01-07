/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: UtilObject.js
 */

function UtilObject() {
	"use strict";
    this.theObjectName = "UtilObject";

    this.objectName = function () {
        return this.theObjectName;
    };

    this.userIndex = function () {
        return this.theUserIndex;
    };

    this.setUserIndex = function (val) {
        this.theUserIndex = val;
    };

    this.logit = function (s1_val, s2_val) {
        return this.utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, s2_val) {
        return this.utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.utilLogit = function (s1_val, s2_val) {
        if (this.userIndex() === undefined) {
            window.console.log(s1_val + "() " + s2_val);
        } else {
            window.console.log(this.userIndex() + s1_val + "() " + s2_val);
        }
    };

    this.utilAbend = function (s1_val, s2_val) {
        if (this.userIndex() === undefined) {
            window.console.log("abend: " + s1_val + "() " + s2_val);
        } else {
            window.console.log(this.userIndex() + "abend: " + s1_val + "() " + s2_val);
        }
        window.alert("abend: " + s1_val + "() " + s2_val);
        var x = junk;
    };
}

