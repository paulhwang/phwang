/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionMgrObject.js
 */

function SessionMgrObject(root_object_val) {
    "use strict";
    this.theObjectName = "SessionMgrObject";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };
}

