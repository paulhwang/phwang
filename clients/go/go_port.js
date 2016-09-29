/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_port.js
 */

function GoPortObject(container_val) {
    "use strict";
    this.theObjectName = "GoPortObject";
    this.theContainerObject = container_val;
    this.GO_PROTOCOL_CODE_SIZE = 7;
    this.GO_PROTOCOL_CODE_PROPOSE = "Propose";
    this.GO_PROTOCOL_CODE_ACCEPT = "Accept ";
    this.GO_PROTOCOL_CODE_CONFIRM = "Confirm";
    this.GO_PROTOCOL_CODE_MOVE_DATA = "Move   ";
    this.GO_PROTOCOL_CODE_SPECIAL_MOVE = "Special";
    this.GO_PROTOCOL_CODE_BOARD_DATA = "Board  ";

    this.objectName = function () {
        return this.theObjectName;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.rootObject = function () {
        return this.containerObject().rootObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajxObject = function () {
        return this.rootObject().ajxObject();
    };

    this.sessionMgrObject = function () {
        return this.rootObject().sessionMgrObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.sessionObject = function () {
        return this.containerObject().sessionObject();
    };

    this.GoHandlerObject = function () {
        return this.containerObject().handlerObject();
    };

    this.receiveQueue = function () {
        return this.theReceiveQueue;
    };

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.transmitMoveData = function (move_val) {
        //this.logit("transmitMoveData", "(" + move_val.xX_() + "," + move_val.yY_() + ") color=" +  move_val.myColor_() + " turn=" +  move_val.turnIndex_());
        var data = this.GO_PROTOCOL_CODE_MOVE_DATA + move_val.encodeMove();
        this.logit("transmitMoveData", "data=" + data);
        this.transmitStringData(data);
    };

    this.transmitSpecialMoveData = function (special_val) {
        //this.goLog("transmitSpecialMoveData", special_val);
        var data = this.GO_PROTOCOL_CODE_SPECIAL_MOVE + special_val;
        this.transmitStringData(data);
    };

    this.transmitStringData = function (str_val) {
        this.sessionObject().transmitQueue().enQueue(str_val);
        this.sessionMgrObject().transmitData();
    };

    this.receiveStringData = function (res_json_val) {
        this.logit("receiveStringData", "res_json_data=" + res_json_val);

        if (res_json_val == null) {
            this.abend("receiveStringData", "null res_json_val");
            return;
        }

        var res_data = JSON.parse(res_json_val);

        if (res_data.board_data !== null) {
            var board_data = res_data.board_data.slice(this.GO_PROTOCOL_CODE_SIZE);
            this.GoHandlerObject().updataBoard(board_data);
        }

        if (res_data.next_color !== null) {
            this.gameObject().setNextColor(res_data.next_color);
        }

        //this.logit("receiveStringData", "res_data.last_dead_stone=" + res_data.last_dead_stone);
        if (res_data.last_dead_stone !== null) {
            this.gameObject().setValidLastDeadInfo(true);
            this.gameObject().setLastDeadX(Number(res_data.last_dead_stone.slice(0, 2)));
            this.gameObject().setLastDeadY(Number(res_data.last_dead_stone.slice(2, 4)));
        } else {
            this.gameObject().setValidLastDeadInfo(false);
        }

        if (res_data.capture_count !== null) {
            this.gameObject().setBlackCaptureStones(Number(res_data.capture_count.slice(0, 3)));
            this.gameObject().setWhiteCaptureStones(Number(res_data.capture_count.slice(3, 6)));
            //this.logit("receiveStringData", "res_data.capture_count=(" + this.gameObject().blackCaptureStones() + "," + this.gameObject().whiteCaptureStones()  + ")");
        }

        if (res_data.game_is_over === false) {
            this.gameObject().clearGameIsOver();
        } else if (res_data.game_is_over === true) {
            this.gameObject().setGameIsOver();
        } else {
            this.abend("receiveStringData", "game_is_over");
        }

        if (res_data.black_score !== null) {
            this.gameObject().setBlackScoreString(res_data.black_score);
        }

        if (res_data.white_score !== null) {
            this.gameObject().setWhiteScoreString(res_data.white_score);
        }

        if (res_data.final_score !== null) {
            this.gameObject().setFinalScoreString(res_data.final_score);
        }
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}

