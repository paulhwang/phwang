/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_config.js
 */

function GoConfigObject(container_val) {
    "use strict";
    this.theContainerObject = container_val;

    this.objectName = function () {
        return "GoConfigObject";
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.sessionObject = function () {
        return this.containerObject().sessionObject();
    };

    this.rootObject = function () {
        return this.sessionObject().rootObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.myName = function () {
        return this.rootObject().myName();
    };

    this.opponentName = function () {
        return this.sessionObject().hisName();
    };

    this.boardSize = function () {
        return this.theBoardSize;
    };

    this.setBoardSize = function (val) {
        this.theBoardSize = Number(val);
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.hisColor = function () {
        if (this.theMyColor === GO.BLACK_STONE()) {
            return GO.WHITE_STONE();
        }
        else {
            return GO.BLACK_STONE();
        }
    };

    this.setMyColor = function (val) {
        if (val === "black") {
            this.theMyColor = GO.BLACK_STONE();
        } else if (val === "white") {
            this.theMyColor = GO.WHITE_STONE();
        } else {
            this.abend("setMyColor", val);
        }
    };

    this.setMyColor_ = function (val) {
        this.theMyColor = Number(val);
    };

    this.handicapPoint = function () {
        return this.theHandicapPoint;
    };

    this.setHandicapPoint = function (val) {
        this.theHandicapPoint = Number(val);
    };

    this.komiPoint = function () {
        return this.theKomiPoint;
    };

    this.setKomiPoint = function (val) {
        this.theKomiPoint = Number(val);
    };

    this.realKomiPoint = function () {
        if (!this.theKomiPoint) {
            return 0;
        }
        return this.theKomiPoint + 0.5;
    };

    this.playBothSides = function () {
        return (this.myName() === this.opponentName());
    };

    this.isValidCoordinate = function (data_val) {
        return (0 <= coordinate_val) && (coordinate_val < board_size_val);
        if (data_val < 0) {
            GO.goAbend("GoBoardObject.isValidCoordinate", data_val);
            return false;
        }
        if (data_val >= this.boardSize()) {
            GO.goAbend("GoBoardObject.isValidCoordinate", data_val);
            return false;
        }
        return true;
    };

    this.createTwoBoardOpponentConfig = function () {
        var config = new GoConfigObject(this.opponentName());
        config.theOpponentName = this.myName();
        config.theBoardSize = this.boardSize();
        config.theMyColor = this.hisColor();
        config.theHandicapPoint = this.handicapPoint();
        config.theKomiPoint = this.komiPoint();
        return config;
    };

    this.isValidCoordinates = function (x_val, y_val) {
        return this.isValidCoordinate(x_val) && this.isValidCoordinate(y_val) ;
    };

    this.isValidCoordinate = function (coordinate_val) {
        return (0 <= coordinate_val) && (coordinate_val < this.boardSize());
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}
