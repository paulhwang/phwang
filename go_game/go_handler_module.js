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
    this.theGoDefineModule = require("./go_define_module.js");

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

    this.GO = function () {
        return this.theGoDefineModule;
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

    this.portObject = function () {
        return this.containerObject().portObject();
    };

    this.uiObject = function () {
        return this.containerObject().uiObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.aMoveIsPlayed = function (str_val) {
        //this.goLog("aMoveIsPlayed", str_val);
        if (this.gameObject().gameIsOver()) {
            var index = 0;
            var x = (str_val.charAt(index++) - '0') * 10;
            x += (str_val.charAt(index++) - '0');
            var y = (str_val.charAt(index++) - '0') * 10;
            y += (str_val.charAt(index++) - '0');
            if ((str_val.charAt(index++) - '0') !== this.GO().MARK_DEAD_STONE_DIFF()) {
                this.abend("aMoveIsPlayed", "game is over");
                return;
            }
            this.engineObject().markDeadGroup(x, y);
            this.engineObject().abendEngine();
            this.portObject().thansmitBoardData();
        } else {
            var move = this.moveModule().malloc(str_val, 0, 0, 0, 0, this.containerObject());
            this.gameObject().addNewMoveAndFight(move);
            this.portObject().thansmitBoardData();
        }
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

