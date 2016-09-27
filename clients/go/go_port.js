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

    this.thansmitBoardData = function (board_val) {
        //this.goLog("transmitBoardData", "data=" + board_val);
        //var data = this.GO_PROTOCOL_CODE_BOARD_DATA + board_val.encodeBoard();
        //this.transmitStringData(data);
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

        /* board data */
        if (res_data.board_data !== null) {
            var board_data = res_data.board_data.slice(this.GO_PROTOCOL_CODE_SIZE);
            this.GoHandlerObject().updataBoard(board_data);
        }

        /* next color */
        if (res_data.next_color !== null) {
            this.gameObject().setNextColor(res_data.next_color);
        }

        /* last dead stone */
        //this.logit("receiveStringData", "res_data.last_dead_stone=" + res_data.last_dead_stone);
        if (res_data.last_dead_stone !== null) {
            this.gameObject().setValidLastDeadInfo(true);
            this.gameObject().setLastDeadX(Number(res_data.last_dead_stone.slice(0, 2)));
            this.gameObject().setLastDeadY(Number(res_data.last_dead_stone.slice(2, 4)));
        } else {
            this.gameObject().setValidLastDeadInfo(false);
        }


/*
        if (req_code == this.GO_PROTOCOL_CODE_MOVE_DATA) {
            //this.GoHandlerObject().aMoveIsPlayed(data);
            this.GoHandlerObject().updataBoard(board_data);
            return;
        }

        if (req_code == this.GO_PROTOCOL_CODE_BOARD_DATA) {
            this.GoHandlerObject().updataBoard(data);
            return;
        }

        if (req_code == this.GO_PROTOCOL_CODE_SPECIAL_MOVE) {
            //this.GoHandlerObject().aSpecialMoveIsPlayed(data);
            this.GoHandlerObject().updataBoard(board_data);
            return;
        }
        */
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}

