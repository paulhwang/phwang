/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_port.js
 */

function GoPortObject(container_val) {
    "use strict";

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.sessionMgrObject = function () {
        return this.theSessionMgrObject;
    };

    this.GoHandlerObject = function () {
        return this.containerObject().handlerObject();
    };

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

    this.transmitStringData = function (str_val) {
        //this.goLog("transmitStringData", str_val);
        this.sessionMgrObject().transmitStringData(str_val);
    };

    this.receiveStringData = function (str_val) {
        //this.goLog("receiveStringData", str_val);
        if (str_val == null) {
            this.goAbend("receiveStringData", "null input");
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

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend("GoPortObject." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog("GoPortObject." + str1_val, str2_val);
    };

    this.GO_PROTOCOL_CODE_SIZE = 7;
    this.GO_PROTOCOL_CODE_PROPOSE = "Propose";
    this.GO_PROTOCOL_CODE_ACCEPT = "Accept ";
    this.GO_PROTOCOL_CODE_CONFIRM = "Confirm";
    this.GO_PROTOCOL_CODE_MOVE_DATA = "Move   ";
    this.GO_PROTOCOL_CODE_SPECIAL_MOVE = "Special";

    this.theContainerObject = container_val;
    this.theSessionMgrObject = new SessionMgrObject(this);
}

