/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_container.js
 */

function GoContainerObject(session_object_val, config_object_val, index_val) {
    "use strict";
    this.theObjectName = "GoContainerObject";
    this.theSessionObject = session_object_val;
    this.theConfigObject = config_object_val;
    this.theContainerIndex = index_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.sessionObject = function () {
        return this.theSessionObject;
    };

    this.rootObject = function () {
        return this.sessionObject().rootObject();
    };

    this.sessionObject = function () {
        return this.theSessionObject;
    };

    this.configObject = function () {
        return this.theConfigObject;
    };

    this.uiObject = function () {
        return this.theUiObject;
    };

    this.containerIndex = function () {
        return this.theContainerIndex;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.boardObject = function () {
        return this.theBoardObject;
    };

    this.engineObject = function () {
        return this.theEngineObject;
    };

    this.gameObject = function () {
        return this.theGameObject;
    };

    this.handlerObject = function () {
        return this.theHandlerObject;
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.containerObject2 = function () {
        return this.theConfigObject2;
    };

    this.setHisContainerObject = function (container2_val) {
        this.theConfigObject2 = container2_val;
    };

    this.lastGame = function () {
        return window.localStorage.lastGame;
    }

    this.setLastGame = function (str_val) {
        window.localStorage.lastGame = str_val;
    }

    this.resetContainerObjectForNewGame = function () {
        this.goLog("resetContainerObjectForNewGame", "");
        this.setLastGame(0);
        this.gameObject().resetGameObjectData();
        this.boardObject().resetBoardObjectData();
        this.engineObject().resetEngineObjectData();
    };

    this.abend = function (str1_val, str2_val) {
        return this.goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.goLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (s1_val, s2_val) {
        this.utilObject().utilLogit(this.containerIndex() + s1_val, s2_val);
    };

    this.goAbend = function (s1_val, s2_val) {
        this.utilObject().utilAbend(this.containerIndex() + s1_val, s2_val);
    };

    this.theUiObject = new GoUiObject("goCanvas");
    this.utilObject().setUserIndex(this.containerIndex());
    this.theConfigObject.setContainerObject(this);

    //this.goLog("GoContainerObject", "color=" + this.configObject().myColor() + " board_size=" + this.configObject().boardSize());
    this.theBoardObject = new GoBoardObject(this.configObject());

    this.theUiObject.setContainerObject(this);

    this.theEngineObject = new GoEngineObject(this);
    this.theGameObject = new GoGameObject(this, this.lastGame());
    //this.goLog("GoContainerObject", "color=" + this.configObject().myColor() + " board_size=" + this.configObject().boardSize());
    this.theHandlerObject = new GoHandlerObject(this);
    this.thePortObject = new GoPortObject(this);

    this.gameObject().processTheWholeMoveList();

    this.sessionObject().setupClientReceiveCallback(ajaxReceiveCallback, this);
    this.rootObject().ajaxObject().initiateSessionConnection(this.sessionObject());
}

function ajaxReceiveCallback (container_val, data_val) {
    //console.log("ajaxReceiveCallBack" + port_val.objectName());
    container_val.portObject().receiveStringData(data_val);
}

var GO = new GoDefineObject;
function GoDefineObject() {
    this.objectName = "GoDefineObject";

    this.THE_FORWARD_MOVE = "FORWARD";
    this.THE_BACKWARD_MOVE = "BACKWARD";
    this.THE_DOUBLE_FORWARD_MOVE = "DOUBLE_FORWARD";
    this.THE_DOUBLE_BACKWARD_MOVE = "DOUBLE_BACKWARD";
    this.THE_PASS_MOVE = "PASS";
    this.THE_RESIGN_MOVE = "RESIGN";
    this.THE_BACK_TO_PLAY_MOVE = "BACK_TO_PLAY";
    this.THE_CONFIRM_MOVE = "CONFIRM";
    this.THE_PLAY_ANOTHER_GAME_MOVE = "PLAY_ANOTHER_GAME";

    this.THE_EMPTY_STONE = 0;
    this.THE_BLACK_STONE = 1;
    this.THE_WHITE_STONE = 2;
    this.THE_BOTH_COLOR_STONE = 2;
    this.THE_MARK_DEAD_STONE_DIFF = 8;
    this.THE_MARK_EMPTY_STONE_DIFF = 16;

    this.THE_MARKED_DEAD_BLACK_STONE  = (this.THE_BLACK_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_DEAD_WHITE_STONE  = (this.THE_WHITE_STONE + this.THE_MARK_DEAD_STONE_DIFF);
    this.THE_MARKED_EMPTY_BLACK_STONE = (this.THE_BLACK_STONE + this.THE_MARK_EMPTY_STONE_DIFF);
    this.THE_MARKED_EMPTY_WHITE_STONE = (this.THE_WHITE_STONE + this.THE_MARK_EMPTY_STONE_DIFF);

    //this.X_Y_VALUE_FOR_PASS = 99;


    this.FORWARD_MOVE = function () {return this.THE_FORWARD_MOVE;};
    this.BACKWARD_MOVE = function () {return this.THE_BACKWARD_MOVE;};
    this.DOUBLE_FORWARD_MOVE = function () {return this.THE_DOUBLE_FORWARD_MOVE;};
    this.DOUBLE_BACKWARD_MOVE = function () {return this.THE_DOUBLE_BACKWARD_MOVE;};
    this.PASS_MOVE = function () {return this.THE_PASS_MOVE;};
    this.RESIGN_MOVE = function () {return this.THE_RESIGN_MOVE;};
    this.BACK_TO_PLAY_MOVE = function () {return this.THE_BACK_TO_PLAY_MOVE;};
    this.CONFIRM_MOVE = function () {return this.THE_CONFIRM_MOVE;};
    this.PLAY_ANOTHER_GAME_MOVE = function () {return this.THE_PLAY_ANOTHER_GAME_MOVE;};

    this.EMPTY_STONE = function () {return this.THE_EMPTY_STONE;};
    this.BLACK_STONE = function () {return this.THE_BLACK_STONE;};
    this.WHITE_STONE = function () {return this.THE_WHITE_STONE;};
    this.BOTH_COLOR_STONE = function () {return this.THE_BOTH_COLOR_STONE;};
    this.MARK_DEAD_STONE_DIFF = function () {return this.THE_MARK_DEAD_STONE_DIFF;};
    this.MARK_EMPTY_STONE_DIFF = function () {return this.THE_MARK_EMPTY_STONE_DIFF;};

    this.MARKED_DEAD_BLACK_STONE = function () {return this.THE_MARKED_DEAD_BLACK_STONE;};
    this.MARKED_DEAD_WHITE_STONE = function () {return this.THE_MARKED_DEAD_WHITE_STONE;};
    this.MARKED_EMPTY_BLACK_STONE = function () {return this.THE_MARKED_EMPTY_BLACK_STONE;};
    this.MARKED_EMPTY_WHITE_STONE = function () {return this.THE_MARKED_EMPTY_WHITE_STONE;};

//    this.X_Y_VALUE_FOR_PASS_ = function () {return this.X_Y_VALUE_FOR_PASS;}

    this.getOppositeColor = function (color_val) {
        switch (color_val) {
        case GO.BLACK_STONE():
            return GO.WHITE_STONE();

        case GO.WHITE_STONE():
            return GO.BLACK_STONE();

        default:
            this.goAbend("getOppositeColor", "color=" + color_val);
            return GO.EMPTY_STONE();
        }
    };

    this.isNeighborStone = function (x1_val, y1_val, x2_val, y2_val) {
        if (x1_val === x2_val) {
            if ((y1_val + 1 === y2_val) || (y1_val - 1 === y2_val)) {
                return true;
            }
        }
        if (y1_val === y2_val) {
            if ((x1_val + 1 === x2_val) || (x1_val - 1 === x2_val)) {
                return true;
            }
        }
        return false;
    };
  
    this.isValidCoordinates = function (x_val, y_val, board_size_val) {
        return this.isValidCoordinate(x_val, board_size_val) && this.isValidCoordinate(y_val, board_size_val) ;
    };

    this.isValidCoordinate = function (coordinate_val, board_size_val) {
        return (0 <= coordinate_val) && (coordinate_val < board_size_val);
    };

    this.goLog = function (s1_val, s2_val) {
        window.console.log(s1_val + "() " + s2_val);
    };

    this.goAbend = function (s1_val, s2_val) {
        window.console.log("goAbend: " + s1_val + "() " + s2_val);
        window.alert("Abend: " + s1_val + "() " + s2_val);
        var x = junk;
    };
}
