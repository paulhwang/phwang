/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_port.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoPortObject(container_val);
    },
};

function GoPortObject(container_val) {
    "use strict";
    this.theUtilModule = require("./../util_module.js");
    this.theGoDefineModule = require("./go_define_module.js");
    this.theContainerModule = require("./go_container_module.js");

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
        return this.sessionObject().sessionMgrObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.engineObject = function () {
        return this.containerObject().engineObject();
    };

    this.topicObject = function () {
        return this.containerObject().topicObject();
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

/*
    this.transmitMoveData = function (move_val) {
        //this.goLog("transmitMoveData", "(" + move_val.xX_() + "," + move_val.yY_() + ") color=" +  move_val.myColor_() + " turn=" +  move_val.turnIndex_());
        var data = this.GO_PROTOCOL_CODE_MOVE_DATA + move_val.encodeMove();
        //this.goLog("transmitMoveData", "data=" + data);
        this.transmitStringData(data);
    };

    this.transmitSpecialMoveData = function (special_val) {
        //this.goLog("transmitSpecialMoveData", special_val);
        var data = this.GO_PROTOCOL_CODE_SPECIAL_MOVE + special_val;
        this.transmitStringData(data);
    };
*/

    this.thansmitBoardData = function () {
        //this.goLog("transmitBoardData", "data=" + board_val);
        var board_data = this.GO_PROTOCOL_CODE_BOARD_DATA + this.boardObject().encodeBoard();
        var json_data = JSON.stringify({
                        board_data: board_data,
                        next_color: this.gameObject().nextColor(),
                        last_dead_stone: this.engineObject().lastDeadStone(),
                        capture_count: this.engineObject().captureCount(),
                        game_is_over: this.gameObject().gameIsOver(),
                    });
        this.transmitData(json_data);
    };

    this.transmitData = function (data_val) {
        this.topicObject().enqueueTransmitData(data_val);
        this.topicObject().processTransmitData();
    };

    this.receiveStringData = function (str_val) {
        this.logit("receiveStringData", str_val);

        if (str_val == null) {
            this.abend("receiveStringData", "null input");
            return;
        }

        var code = str_val.slice(0, this.GO_PROTOCOL_CODE_SIZE);
        var data = str_val.slice(this.GO_PROTOCOL_CODE_SIZE);
        //this.goLog("receiveStringData", code);
        //this.goLog("receiveStringData", data);

        if (code == this.GO_PROTOCOL_CODE_MOVE_DATA) {
            this.GoHandlerObject().aMoveIsPlayed(data);
            return;
        }

        if (code == this.GO_PROTOCOL_CODE_SPECIAL_MOVE) {
            this.GoHandlerObject().aSpecialMoveIsPlayed(data);
            return;
        }
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };
}

