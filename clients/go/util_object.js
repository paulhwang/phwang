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

    this.logit = function (str1_val, str2_val) {
        return this.utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.utilLogit = function (str1_val, str2_val) {
        window.console.log(str1_val + "() " + str2_val);
    };

    this.utilAbend = function (str1_val, str2_val) {
        window.console.log("abend: " + str1_val + "() " + str2_val);
        window.alert("abend: " + str1_val + "() " + str2_val);
        var x = junk;
    };
}

