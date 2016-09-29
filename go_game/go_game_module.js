/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_game.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoGameObject(container_val);
    },
};

function GoGameObject(container_val, str_val) {
    "use strict";
    this.theUtilModule = require("./../util_module.js");
    this.theGoDefineModule = require("./go_define_module.js");
    this.theContainerModule = require("./go_container_module.js");
    this.theGroupListModule = require("./go_group_list_module.js");

    this.theContainerObject = container_val;

    this.objectName = function () {
        return "GoGameObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.GO = function () {
        return this.theGoDefineModule;
    };

    this.containerModule = function () {
        return this.theContainerModule;
    };

    this.groupListModule = function () {
        return this.theGroupListModule;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.uiObject = function () {
        return this.containerObject().uiObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.portObject = function () {
        return this.containerObject().portObject();
    };

    this.maxMove = function () {
        return this.theMaxMove;
    };

    this.setMaxMove = function (max_move_val) {
        this.theMaxMove = max_move_val;
    };

    this.totalMoves = function () {
        return this.theTotalMoves;
    };

    this.setTotalMoves = function (total_moves_val) {
        this.theTotalMoves = total_moves_val;
    };

    this.incrementTotalMoves = function () {
        this.theTotalMoves += 1;
    };

    this.decrementTotalMoves = function () {
        this.theTotalMoves -= 1;
    };

    this.movesArray = function (i) {
        return this.theMovesArray[i];
    };

    this.setMovesArray = function (i, val) {
        this.theMovesArray[i] = val;
    };

    this.nextColor = function () {
        return this.theNextColor;
    };

    this.setNextColor = function (next_color_val) {
        this.theNextColor = next_color_val;
    };

    this.reverseNextColor________ = function () {
        if (this.nextColor_() === this.GO().BLACK_STONE_()) {
            this.nextColor__(this.GO().WHITE_STONE_());
        } else if (this.nextColor_() === this.GO().WHITE_STONE_()) {
            this.nextColor__(this.GO().BLACK_STONE_());
        } else {
            this.goAbend("renewNextColor", "");
        }
    };

    this.passReceived = function () {
        return this.thePassReceived;
    };

    this.setPassReceived = function () {
        this.thePassReceived = true;
    };

    this.clearPassReceived = function () {
        this.thePassReceived = false;
    };

    this.gameIsOver = function () {
        return this.theGameIsOver;
    };

    this.setGameIsOver = function () {
        this.theGameIsOver = true;
    };

    this.clearGameIsOver = function () {
        this.theGameIsOver = false;
    };

    this.getLastMove = function () {
        if (this.totalMoves() <= 0) {
            return null;
        }
        return this.movesArray(this.totalMoves() - 1);
    };

    this.isLastMove = function (x_val, y_val) {
        var move = this.getLastMove();
        if (move && (move.xX() === x_val) && (move.yY() === y_val)) {
            return true;
        }
        return false;
    };

    this.enterGameFromUi = function (x_val, y_val) {
        //this.goLog("GoGameObject.enterGameFromUi", "(" + x_val + "," + y_val + ")");

        if (this.gameIsOver()) {
            this.goLog("enterGameFromUi", "game is over");
            this.engineObject().markDeadGroup(x_val, y_val);
            this.engineObject().abendEngine();
            this.displayResult();
            return;
        } else {
            this.resetBothPasses();
        }

        if (!this.engineObject().isValidMoveOnBoard(x_val, y_val)) {
            return;
        }

        if (this.outstandingUiClick() !== 0) {
            return;
        }
        this.incrementOutstandingUiClick();

        var move = new GoMoveObject(null, x_val, y_val, this.nextColor(), this.totalMoves(), this.containerObject());
        if (!this.configObject().playBothSides()) {
            this.addNewMoveAndFight(move);
        }
        this.portObject().transmitMoveData(move);
    };

    this.addNewMoveAndFight = function (move_val) {
        //this.goLog("addNewMoveAndFight", "");

        if (this.gameIsOver()) {
            this.goLog("addNewMoveAndFight", "two pass have entered");
            return;
        }

        this.clearPassReceived();
        this.insertMoveToMoveList(move_val);
        this.engineObject().enterWar(move_val);
        this.setNextColor(this.GO().getOppositeColor(move_val.myColor()));
    };

    this.addNewMoveWithoutFight = function (x_val, y_val, color_val, turn_val) {
        if (turn_val !== this.totalMoves()) {
            this.goAbend("addNewMoveWithoutFight", "turn=" + turn_val + " " + this.totalMoves());
        }

        var move = this.moveModule.malloc(null, x_val, y_val, color_val, this.totalMoves(), this.containerObject());
        this.insertMoveToMoveList(move);
    };

    this.insertMoveToMoveList = function (move_val) {
        this.setMovesArray(this.totalMoves(), move_val);
        this.incrementTotalMoves();
        this.setMaxMove(this.totalMoves());
    };

    this.receiveSpecialMoveFromOpponent = function (data_val) {
        this.goLog("receiveSpecialMoveFromOpponent", data_val);
        if (data_val === this.GO().FORWARD_MOVE()) {
            this.processForwardMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().DOUBLE_FORWARD_MOVE()) {
            this.processDoubleForwardMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().BACKWARD_MOVE()) {
            this.processBackwardMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().DOUBLE_BACKWARD_MOVE()) {
            this.processDoubleBackwardMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().PASS_MOVE()) {
            this.processPassMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().RESIGN_MOVE()) {
            this.processResignMove();
            return;
        }
        if (data_val === this.GO().BACK_TO_PLAY_MOVE()) {
            this.processBackToPlayMove();
            return;
        }
        if (data_val === this.GO().CONFIRM_MOVE()) {
            this.processConfirmMove();
            this.portObject().thansmitBoardData();
            return;
        }
        if (data_val === this.GO().PLAY_ANOTHER_GAME_MOVE()) {
            this.processPlayAnotherGameMove();
            return;
        }
    };

    this.processDoubleBackwardMove = function () {
        //goDebug("goProcessBackwardMoveFromUi", "");
        this.clearPassReceived();
        if (this.totalMoves() <= this.configObject().handicapPoint()) {
            return;
        }
        this.setTotalMoves(this.configObject().handicapPoint());
        this.processTheWholeMoveList();
    };

    this.processBackwardMove = function () {
        this.goLog("processBackwardMove", "");
        this.clearPassReceived();
        if (this.totalMoves() <= this.configObject().handicapPoint()) {
            return;
        }
        this.decrementTotalMoves();
        this.processTheWholeMoveList();
    };

    this.processForwardMove = function () {
        this.clearPassReceived();
        if (this.totalMoves() > this.maxMove()) {
            this.goAbend("processForwardMove", "totalMoves=" + this.totalMoves_() + " maxMove=" + this.naxMove_());
            return;
        }
        if (this.totalMoves() === this.maxMove()) {
            return;
        }
        this.incrementTotalMoves();
        this.processTheWholeMoveList();
    };

    this.processDoubleForwardMove = function () {
        this.clearPassReceived();
        if (this.totalMoves() > this.maxMove()) {
            this.goAbend("processDoubleForwardMove", "totalMoves=" + this.totalMoves() + " maxMove=" + this.maxMove_());
            return;
        }
        if (this.totalMoves() === this.maxMove()) {
            return;
        }
        this.setTotalMoves(this.maxMove());
        this.processTheWholeMoveList();
    };

    this.processPassMove = function () {
        this.goLog(".processPassMove", "");

        if (!this.passReceived()) {
            this.setPassReceived();
            this.setNextColor(this.GO().getOppositeColor(this.nextColor()));
            return;
        }

        this.setGameIsOver();

        this.engineObject().resetMarkedGroupLists();
        this.displayResult();
        this.goLog("processPassMove", "game is over");
        this.engineObject().computeScore();
        this.engineObject().printScore();
        this.engineObject().abendEngine();
    };

    this.displayResult = function () {
        this.goLog("displayResult", "Black: "
                + this.engineObject().blackScore() + " ("
                + this.engineObject().blackCaptureStones() + " + "
                + this.engineObject().blackLandScore() + " + "
                + this.engineObject().whiteDeadGroupList().totalStoneCount() + "*2)");
        this.goLog("displayResult", "White: "
                + this.engineObject().whiteScore() + " ("
                + this.engineObject().whiteCaptureStones() + " + "
                + this.engineObject().whiteLandScore() + " + "
                + this.engineObject().blackDeadGroupList().totalStoneCount() + "*2)");
    };

    this.processConfirmMoveFromUi = function () {
        if (!this.configObject().playBothSides()) {
            this.processConfirmMove();
        }
        this.portObject().transmitSpecialMoveData(this.GO().CONFIRM_MOVE());
    };

    this.processConfirmMove = function () {
        this.goLog("processConfirmMove", "");
        if (!this.gameIsOver()) {
            return;
        }

        this.engineObject().computeScore();
        this.engineObject().printScore();
        this.engineObject().abendEngine();
    };

    this.processResignMoveFromUi = function () {
        if (!this.configObject().playBothSides()) {
            this.processResignMove();
        }
        this.portObject().transmitSpecialMoveData(this.GO().RESIGN_MOVE());
    };

    this.processResignMove = function () {
        this.goLog("processResignMove", "");
        this.containerObject().resetContainerObjectForNewGame();
        this.engineObject().abendEngine();
    };

    this.processPlayAnotherGameMoveFromUi = function () {
        if (!this.configObject().playBothSides()) {
            this.processResignMove();
        }
        this.portObject().transmitSpecialMoveData(this.GO().PLAY_ANOTHER_GAME_MOVE());
    };

    this.processPlayAnotherGameMove = function () {
        this.goLog("processPlayAnotherGameMove", "");
        this.containerObject().resetContainerObjectForNewGame();
        this.engineObject().abendEngine();
    };

    this.processBackToPlayMoveFromUi = function () {
        if (!this.configObject().playBothSides()) {
            this.processResignMove();
        }
        this.portObject().transmitSpecialMoveData(this.GO().BACK_TO_PLAY_MOVE());
    };

    this.processBackToPlayMove = function () {
        this.goLog("processBackToPlayMove", "");
        if (this.gameIsOver()) {
            this.resetBothPasses();
            this.engineObject().abendEngine();
        }
    };

    this.processTheWholeMoveList = function () {
        this.boardObject().resetBoardObjectData();
        this.engineObject().resetEngineObjectData();
        this.resetGameObjectPartialData();

        this.goLog("processTheWholeMoveLst", "totalMoves=" + this.totalMoves());
        var move;
        var i = 0;
        while (i < this.totalMoves()) {
            move = this.movesArray(i);
            this.engineObject().enterWar(move);
            this.setNextColor(this.GO().getOppositeColor(move.myColor()));
            i += 1;
        }
    };

    this.isMyTurn = function () {
        if (this.configObject().playBothSides()) {
            return true;
        }

        //this.goLog("isMyTurn", "nextColor=" + this.nextColor_() + ", myColor=" + this.configObject().myColor_());
        if (this.nextColor() === this.configObject().myColor()) {
            return true;
        } else {
            return false;
        }
    };

    this.encodeMoveList = function (do_mine_val) {
        var buf = "";

/*
    if (do_mine_val) {
        buf = buf + this.configObject().myColor_();
    }
    else {
        buf = buf + this.configObject().hisColor_();
    }
*/

        if (this.configObject().boardSize() < 10) {
            buf = buf + "0";
        }
        buf = buf + this.configObject().boardSize();

        if (this.configObject().handicapPoint() < 10) {
            buf = buf + "0";
        }
        buf += this.configObject().handicapPoint();

        if (this.configObject().komiPoint() < 10) {
            buf = buf + "0";
        }
        buf = buf + this.configObject().komiPoint();

        if (this.totalMoves() < 100) {
            buf = buf + "0";
        }
        if (this.totalMoves() < 10) {
            buf = buf + "0";
        }
        buf = buf + this.totalMoves();

        if (this.maxMove() < 100) {
            buf = buf + "0";
        }
        if (this.maxMove() < 10) {
            buf = buf + "0";
        }
        buf = buf + this.maxMove();

        var turn1 = 0;
        while (turn1 < this.maxMove()) {
            buf = buf + this.movesArray(turn1).myColor();

            if (this.movesArray(turn1).xX() < 10) {
                buf = buf + "0";
            }
            buf = buf + this.movesArray(turn1).xX();

            if (this.movesArray(turn1).yY() < 10) {
                buf = buf + "0";
            }
            buf = buf + this.movesArray(turn1).yY();

            if (turn1 !== this.movesArray(turn1).turnIndex()) {
                this.goAbend("encodeMoveList", "turn=" + turn1 + " " + this.movesArray(turn1).turnIndex());
            }
            turn1 += 1;
        }

        //GO.goLog("GoGameObject.encodeMoveList", buf);
        return buf;
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend("GoGameObject." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog("GoGameObject." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.decodeMoveList = function (str_val) {
        if (!str_val) {
            //this.goAbend("decodeMoveList", "null input");
            return;
        }

        var index = 0;
        var total_moves1;
        var max_moves1;

        this.GO().goLog("GoGameObject.decodeMoveList", str_val);

        //this.configObject().myColor__(str_val.charAt(index++) - '0');
        this.configObject().setBoardSize(((str_val.charAt(index++) - '0') * 10) + (str_val.charAt(index++) - '0'));
        this.configObject().setHandicapPoint(((str_val.charAt(index++) - '0') * 10) + (str_val.charAt(index++) - '0'));
        this.configObject().setKomiPoint(((str_val.charAt(index++) - '0') * 10) + (str_val.charAt(index++) - '0'));

        total_moves1  = (str_val.charAt(index++) - '0') * 100;
        total_moves1 += (str_val.charAt(index++) - '0') * 10;
        total_moves1 += (str_val.charAt(index++) - '0');

        max_moves1  = (str_val.charAt(index++) - '0') * 100;
        max_moves1 += (str_val.charAt(index++) - '0') * 10;
        max_moves1 += (str_val.charAt(index++) - '0');

        var turn1 = 0;
        while (turn1 < max_moves1) {
            var x, y, color;

            color = str_val.charAt(index++) - '0';
            x  = (str_val.charAt(index++) - '0') * 10;
            x += (str_val.charAt(index++) - '0');
            y  = (str_val.charAt(index++) - '0') * 10;
            y += (str_val.charAt(index++) - '0');

            this.addNewMoveWithoutFight(x, y, color, turn1);
            turn1 += 1;
        }
        if (index !== str_val.length) {
            this.goAbend("decodeMoveList", "index");
        }

        if (max_moves1 !== this.maxMove()) {
            this.goAbend("decodeMoveList", "max_moves " + max_moves1 + " " + this.maxMove_());
        }

        this.setTotalMoves(total_moves1);

        if (str_val !== this.encodeMoveList(true)) {
            this.goAbend("decodeMoveList", "not equal");
        }
    };

    this.saveLastGame = function () {
        this.containerObject().setLastGame(this.encodeMoveList());
    }

    this.resetGameObjectData = function () {
        this.theMaxMove = 0;
        this.theTotalMoves = 0;
        this.theMovesArray = [];
        this.resetGameObjectPartialData();
    };

    this.resetGameObjectPartialData = function () {
        this.theNextColor = this.GO().BLACK_STONE();
        this.thePassReceived = false;
        this.theGameIsOver = false;
    };

    this.resetGameObjectData();
}
