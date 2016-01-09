/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root.js
 */

function RootObject() {
    "use strict";
    this.theObjectName = "RootObject";

    this.objectName = function () {
        return this.theObjectName;
    };

    this.ajxObject = function () {
        return this.theAjxObject;
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

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

    this.linkId = function () {
        return this.theLinkId;
    };

    this.setLinkId = function (val) {
        this.theLinkId = val;
    };

    this.logit = function (s1_val, s2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, s2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theLinkId = 0;
    this.theUtilObject = new UtilObject();
    this.theAjxObject = new AjxObject(this);
    this.theSessionMgrObject = new SessionMgrObject(this);
    this.theMyName = "dummy";
    this.theMyName2 = "";
    this.theLanguageUsed = "English";
    //this.ajxObject().setupLink();
}
