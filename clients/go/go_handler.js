/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_handler.js
 */

"use strict";

function GoHandlerObject(container_val) {
    this.objectName = function () {
        return this.theObjectName;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.uiObject = function () {
        return this.containerObject().uiObject();
    };

    this.aMoveIsPlayed = function (str_val) {
        //this.goLog("aMoveIsPlayed", str_val);
        this.gameObject().decrementOutstandingUiClick();
        var move = new GoMoveObject(str_val, 0, 0, 0, 0, this.containerObject());
        this.gameObject().addNewMoveAndFight(move);
        this.uiObject().drawBoard(this.engineObject());
    };

    this.updataBoard = function (str_val) {
        //this.goLog("updataBoard", str_val);
        this.boardObject().decodeBoard(str_val);
        this.uiObject().drawBoard();
    };

    this.boardUpdate = function (str_val) {
        this.goLog("boardUpdate", str_val);

    };

    this.aSpecialMoveIsPlayed = function (special_str) {
        //GO.goLog("GoHandlerObject.aSpecialMoveIsPlayed", special_str);
        this.gameObject().receiveSpecialMoveFromOpponent(special_str);
        this.uiObject().drawBoard();
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.theObjectName = "GoHandlerObject";
    this.theContainerObject = container_val;
}

