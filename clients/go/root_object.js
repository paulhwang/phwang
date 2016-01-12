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

    this.htmlObject = function () {
        return this.theHtmlObject;
    };

    this.ajaxObject = function () {
        return this.theAjaxObject;
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

    this.setHtmlObject = function (val) {
        this.theHtmlObject = val;
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

    this.nameListLength = function () {
        return this.theNameList.length;
    };

    this.nameList = function (index_val) {
        return this.theNameList[index_val];
    };

    this.setNameList = function (index_val, data_val) {
        return this.theNameList[index_val] = data_val;
    };

    this.nameListDone = function () {
        return this.theNameListDone;
    };

    this.setNameListDone = function () {
        return this.theNameListDone;
    };

    this.logit = function (s1_val, s2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, s2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theLinkId = 0;
    this.theUtilObject = new UtilObject();
    this.theAjaxObject = new AjaxObject(this);
    this.theSessionMgrObject = new SessionMgrObject(this);
    this.theHtmlObject = new GoHtmlObject(this);
    this.theNameList = ["steve", "john", "david"];
    this.theNameListDone = false;
}
