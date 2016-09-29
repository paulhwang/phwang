/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_game.js
 */

function GoGameObject(container_val, str_val) {
    "use strict";
    this.theContainerObject = container_val;

    this.objectName = function () {
        return "GoGameObject";
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
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

    this.blackCaptureStones = function () {
        return this.theBlackCaptureStones;
    };

    this.whiteCaptureStones = function () {
        return this.theWhiteCaptureStones;
    };

    this.setBlackCaptureStones = function (count_val) {
        this.theBlackCaptureStones = count_val;
    };

    this.setWhiteCaptureStones = function (count_val) {
        this.theWhiteCaptureStones = count_val;
    };

    this.lastEnteredX = function () {
        return this.theLastEnteredX;
    };

    this.setLastEnteredX = function (val) {
        this.theLastEnteredX = val;
    };

    this.lastEnteredY = function () {
        return this.theLastEnteredY;
    };

    this.setLastEnteredY = function (val) {
        this.theLastEnteredY = val;
    };

    this.lastDeadX = function () {
        return this.theLastDeadX;
    };

    this.setLastDeadX = function (val) {
        this.theLastDeadX = val;
    };

    this.lastDeadY = function () {
        return this.theLastDeadY;
    };

    this.setLastDeadY = function (val) {
        this.theLastDeadY = val;
    };

    this.validLastDeadInfo = function () {
        return this.theValidLastDeadInfo;
    };

    this.setValidLastDeadInfo = function (val) {
        this.theValidLastDeadInfo = val;
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

    this.blackScoreString = function () {
        return this.theBlackScoreString;
    }

    this.setBlackScoreString = function (val) {
        this.theBlackScoreString = val;
    }

    this.whiteScoreString = function () {
        return this.theWhiteScoreString;
    }

    this.setWhiteScoreString = function (val) {
        this.theWhiteScoreString = val;
    }

    this.finalScoreString = function () {
        return this.theFinalScoreString;
    }

    this.setFinalScoreString = function (val) {
        this.theFinalScoreString = val;
    }

    this.setFinalScoreString = function (val) {
        this.theFinalScoreString = val;
    }

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
        this.goLog("GoGameObject.enterGameFromUi", "(" + x_val + "," + y_val + ")");

        if (this.gameIsOver()) {
            var move = new GoMoveObject(null, x_val, y_val, GO.THE_MARK_DEAD_STONE_DIFF, this.totalMoves(), this.containerObject());
            this.portObject().transmitMoveData(move);
            return;
        }

        if (!this.isValidMoveOnBoard(x_val, y_val)) {
            return;
        }
        var move = new GoMoveObject(null, x_val, y_val, this.nextColor(), this.totalMoves(), this.containerObject());
        this.portObject().transmitMoveData(move);
    };

    this.receiveSpecialMoveFromOpponent = function (data_val) {
        this.goLog("receiveSpecialMoveFromOpponent", data_val);
        if (data_val === GO.RESIGN_MOVE()) {
            this.processResignMove();
            return;
        }
        if (data_val === GO.BACK_TO_PLAY_MOVE()) {
            this.processBackToPlayMove();
            return;
        }
        if (data_val === GO.CONFIRM_MOVE()) {
            this.processConfirmMove();
            return;
        }
        if (data_val === GO.PLAY_ANOTHER_GAME_MOVE()) {
            this.processPlayAnotherGameMove();
            return;
        }
    };

    this.processDoubleBackwardMoveFromUi = function () {
        this.portObject().transmitSpecialMoveData(GO.DOUBLE_BACKWARD_MOVE());
    };

    this.processDoubleBackwardMove = function () {
        //goDebug("goProcessBackwardMoveFromUi", "");
        this.resetBothPasses();
        if (this.totalMoves() <= this.configObject().handicapPoint()) {
            return;
        }
        this.setTotalMoves(this.configObject().handicapPoint());
        this.processTheWholeMoveList();
    };

    this.processBackwardMoveFromUi = function () {
        this.portObject().transmitSpecialMoveData(GO.BACKWARD_MOVE());
    };

    this.processBackwardMove = function () {
        this.goLog("processBackwardMove", "");
        this.resetBothPasses();
        if (this.totalMoves() <= this.configObject().handicapPoint()) {
            return;
        }
        this.decrementTotalMoves();
        this.processTheWholeMoveList();
    };

    this.processForwardMoveFromUi = function () {
        this.portObject().transmitSpecialMoveData(GO.FORWARD_MOVE());
    };

    this.processForwardMove = function () {
        this.resetBothPasses();
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

    this.processDoubleForwardMoveFromUi = function () {
        this.portObject().transmitSpecialMoveData(GO.DOUBLE_FORWARD_MOVE());
    };

    this.processDoubleForwardMove = function () {
        this.resetBothPasses();
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

    this.processPassMoveFromUi = function () {
        this.portObject().transmitSpecialMoveData(GO.PASS_MOVE());
    };

    this.processPassMove = function () {
        this.goLog(".processPassMove", "");

        this.setNextColor(GO.getOppositeColor(this.nextColor()));

        if (this.gameIsOver()) {
            this.engineObject().resetMarkedGroupLists();
            this.displayResult();
            this.goLog("processPassMove", "game is over");
            this.engineObject().computeScore();
            this.engineObject().printScore();
            this.engineObject().abendEngine();
        }
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
        this.portObject().transmitSpecialMoveData(GO.CONFIRM_MOVE());
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
        this.portObject().transmitSpecialMoveData(GO.RESIGN_MOVE());
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
        this.portObject().transmitSpecialMoveData(GO.PLAY_ANOTHER_GAME_MOVE());
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
        this.portObject().transmitSpecialMoveData(GO.BACK_TO_PLAY_MOVE());
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
        this.resetGameObjectPartialData();
/*
        this.goLog("processTheWholeMoveLst", "totalMoves=" + this.totalMoves());
        var move;
        var i = 0;
        while (i < this.totalMoves()) {
            move = this.movesArray(i);
            this.engineObject().enterWar(move);
            this.setNextColor(GO.getOppositeColor(move.myColor()));
            i += 1;
        }
*/
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

    this.saveLastGame = function () {
        this.containerObject().setLastGame(this.encodeMoveList());
    }

    this.resetGameObjectData = function () {
        this.theTotalMoves = 0;
        this.theMovesArray = [];
        this.resetGameObjectPartialData();
    };

    this.resetGameObjectPartialData = function () {
        this.theNextColor = GO.BLACK_STONE();
        this.theGameIsOver = false;
    };

    this.isValidMoveOnBoard = function (x_val, y_val) {
        if (this.boardObject().boardArray(x_val, y_val) !== GO.EMPTY_STONE()) {
            return false;
        }

        if (this.validLastDeadInfo() && (x_val === this.lastDeadX()) && (y_val === this.lastDeadY())) {
            return false;
        }

        return true;
    };

    this.resetGameObjectData();

    this.theBlackCaptureStones = 0;
    this.theWhiteCaptureStones = 0;

    this.theLastDeadX = 0;
    this.theLastDeadY = 0;
    this.theValidLastDeadInfo = false;
    this.theBlackScoreString = null;
    this.theWhiteScoreString = null;
    this.theFinalScoreString = null;
}
