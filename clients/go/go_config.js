/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_config.js
 */

function GoConfigObject(my_name_val, his_name_val, board_size_val, my_color_val, handicap_val, komi_val) {
    "use strict";

    this.container_Object = function () {
        return this.theContainerObject;
    };

    this.myName = function () {
        return this.theMyName;
    };

    this.opponentName = function () {
        return this.theOpponentName;
    };

    this.setOpponentName = function (val) {
        this.theOpponentName = val;
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

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend("GoConfigObject." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog("GoConfigObject." + str1_val, str2_val);
    };

    this.theMyName = my_name_val;
    this.theOpponentName = his_name_val;
    this.theBoardSize = board_size_val;
    this.theMyColor = my_color_val;
    this.theHandicapPoint = handicap_val;
    this.theKomiPoint = komi_val;

    this.setContainerObject = function (container_val) {
        this.theContainerObject = container_val;
    };
}
