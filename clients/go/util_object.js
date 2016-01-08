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

    this.logit = function (str1_val, str2_val) {
        return this.utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.utilLogit = function (str1_val, str2_val) {
        if (this.userIndex() === undefined) {
            window.console.log(str1_val + "() " + str2_val);
        } else {
            window.console.log(this.userIndex() + str1_val + "() " + str2_val);
        }
    };

    this.utilAbend = function (str1_val, str2_val) {
        if (this.userIndex() === undefined) {
            window.console.log("abend: " + str1_val + "() " + str2_val);
        } else {
            window.console.log(this.userIndex() + "abend: " + str1_val + "() " + str2_val);
        }
        window.alert("abend: " + str1_val + "() " + str2_val);
        var x = junk;
    };
}

