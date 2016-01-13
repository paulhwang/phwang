/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_board.js
 */

"use strict";

function GoBoardObject(config_val) {
    this.objectName = function () {
        return this.theObjectName;
    };

    this.configObject = function () {
        return this.theConfigObject;
    };

    this.boardSize = function () {
        return this.configObject().boardSize();
    };

    this.boardArray = function (x_val, y_val) {
        return this.theBoardArray[x_val][y_val];
    };

    this.markedBoardArray = function (x_val, y_val) {
        return this.theMarkedBoardArray[x_val][y_val];
    };

    this.setBoardArray = function (x_val, y_val, data_val) {
        this.theBoardArray[x_val][y_val] = data_val;
    };

    this.setMarkedBoardArray = function (x_val, y_val, data_val) {
        this.theMarkedBoardArray[x_val][y_val] = data_val;
    };

    this.addStoneToBoard = function (x_val, y_val, color_val) {
        if (!GO.isValidCoordinates(x_val, y_val, this.configObject().boardSize())) {
            this.goAbend("addStoneToBoard", "x=" + x_val + " y=" + y_val);
            return;
        }

        this.setBoardArray(x_val, y_val, color_val);
    };

    this.addStoneToMarkedBoard = function (x_val, y_val, color_val) {
        if (!GO.isValidCoordinates(x_val, y_val, this.configObject().boardSize())) {
            this.goAbend("addStoneToMarkedBoard", "x=" + x_val + " y=" + y_val);
            return;
        }

        this.setMarkedBoardArray(x_val, y_val, color_val);
    };

    this.removeStoneFromMarkedBoard = function (x_val, y_val) {
        if (!GO.isValidCoordinates(x_val, y_val, this.configObject().boardSize())) {
            this.goAbend("addStoneToMarkedBoard", "x=" + x_val + " y=" + y_val);
            return;
        }

        this.setMarkedBoardArray(x_val, y_val, GO.EMPTY_STONE());
    };

    this.isEmptySpace = function (x_val, y_val) {
        if (!GO.isValidCoordinates(x_val, y_val, this.configObject().boardSize())) {
            return false;
        }
        if (this.boardArray(x_val, y_val) !== GO.EMPTY_STONE()) {
            return false;
        }
        return true;
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.resetMarkedBoardObjectData = function () {
        var i, j;

        i = 0;
        while (i < this.boardSize()) {
            j = 0;
            while (j < this.boardSize()) {
                this.setMarkedBoardArray(i, j, GO.EMPTY_STONE());
                j += 1;
            }
            i += 1;
        }
    };


    this.resetBoardObjectData = function () {
        var i, j;

        //this.goLog("resetBoardObjectData", "boardSize=" + this.boardSize());
        i = 0;
        while (i < this.boardSize()) {
            j = 0;
            while (j < this.boardSize()) {
                this.setBoardArray(i, j, GO.EMPTY_STONE());
                j += 1;
            }
            i += 1;
        }
    };

    var i;

    this.theObjectName = "GoBoardObject";
    this.theConfigObject = config_val;
    this.theBoardArray = [19];
    this.theMarkedBoardArray = [19];
    i = 0;
    while (i < 19) {
        this.theBoardArray[i] = [19];
        this.theMarkedBoardArray[i] = [19];
        i += 1;
    }
    this.resetBoardObjectData();
}
