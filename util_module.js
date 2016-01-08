/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: util_module.js
 */

var theUtilObject;

module.exports = {
    init: function () {
        theUtilObject = new UtilObject();
        theUtilObject.setUserIndex(0);
    },

    setIndex: function (index_val) {
        userIndex = index_val;
    },

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
        alert("abend: " + str1_val + "() " + str2_val);
        var x = junk;
    };
}
