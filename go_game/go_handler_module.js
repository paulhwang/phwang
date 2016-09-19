/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_handler_module.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoHandlerObject(container_val);
    },
};

function GoHandlerObject(container_val) {
    "use strict";
    this.theUtilModule = require("./../util_module.js");
    //this.theGoContainerModule = require("./go_container_module.js")
    this.theGoMoveModule = require("./go_move_module.js")
    this.theGoBoardModule = require("./go_board_module.js")

    this.theObjectName = "GoHandlerObject";
    this.theContainerObject = container_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.moveModule = function () {
        return this.theGoMoveModule;
    };

    this.boardModule = function () {
        return this.theGoBoardModule;
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

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.aMoveIsPlayed = function (str_val) {
        //this.goLog("aMoveIsPlayed", str_val);
        //this.gameObject().decrementOutstandingUiClick();
        var move = this.moveModule().malloc(str_val, 0, 0, 0, 0, this.containerObject());
        this.gameObject().addNewMoveAndFight(move);
        ////////////////////////this.uiObject().drawBoard(this.engineObject());
    };

    this.updateBoard______ = function (str_val) {
        //this.goLog("updateBoard", str_val);
        var board = this.boardModule().malloc(this.containerObject());
        board.decodeBoard(str_val);
        this.boardObject().compareBoards(board);
        //this.uiObject().drawBoard(this.engineObject());
    };

    this.aSpecialMoveIsPlayed = function (special_str) {
        //GO.goLog("GoHandlerObject.aSpecialMoveIsPlayed", special_str);
        this.gameObject().receiveSpecialMoveFromOpponent(special_str);
        //this.uiObject().drawBoard(this.engineObject());
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}

