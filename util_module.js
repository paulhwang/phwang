/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: util_module.js
 */

module.exports = {
    logit: function (str1_val, str2_val) {
        theUtilObject.logit(str1_val, str2_val);
    },

    abend: function (str1_val, str2_val) {
        theUtilObject.abend(str1_val, str2_val);
    },

    utilLogit: function (str1_val, str2_val) {
        theUtilObject.utilLogit(str1_val, str2_val);
    },

    utilAbend: function (str1_val, str2_val) {
        theUtilObject.utilAbend(str1_val, str2_val);
    },
};

var theUtilObject = new UtilObject();

function UtilObject() {
    "use strict";
    this.theUserIndex = 0;

    this.objectName = function () {
        return "UtilObject";
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
        if (str2_val === undefined) {
            str2_val = "UNDEFINED";
        }
        if (str2_val === null) {
            str2_val = "NULL";
        }
        if (this.userIndex() === undefined) {
            console.log(str1_val + "() " + str2_val);
        } else {
            console.log(this.userIndex() + ": " + str1_val + "() " + str2_val);
        }
    };

    this.utilAbend = function (str1_val, str2_val) {
        if (this.userIndex() === undefined) {
            console.log("abend: " + str1_val + "() " + str2_val);
        } else {
            console.log("***abend***" + this.userIndex() + ": " + str1_val + "() " + str2_val);
        }
        //alert("abend: " + str1_val + "() " + str2_val);
        //var x = junk;
    };
}
