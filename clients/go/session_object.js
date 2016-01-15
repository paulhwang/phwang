/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionObject.js
 */

function SessionObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "SessionObject";
    };

    this.setHisName = function (val) {
        this.theHisName = val;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.ajaxObject = function () {
        return this.rootObject().ajaxObject();
    };

    this.clientReceiveCallbackFunc = function() {
        return this.theClientReceiveCallbackFunc;
    };

    this.clientObject = function () {
        return this.theClientObject;
    };

    this.myName = function () {
        return this.rootObject().myName();
    };

    this.hisName = function () {
        return this.theHisName;
    };

    this.gameName = function () {
        return this.theGameName;
    };

    this.setGameName = function (val) {
        this.theGameName = val;
    };

    this.xmtSeq = function () {
        return this.theXmtSeq;
    };

    this.incrementXmtSeq = function () {
        this.theXmtSeq += 1;
    };

    this.rcvSeq = function () {
        return this.theRcvSeq;
    };

    this.incrementRcvSeq = function () {
        this.theRcvSeq += 1;
    };

    this.sessionId = function () {
        return this.theSessionId;
    };

    this.setSessionId = function (val) {
        this.theSessionId = val;
    };

    this.setContainerObject = function (val) {
        this.theContainerObject = val;
    };

    //this.receiveQueue = function () {
    //    return this.theReceiveQueue;
    //};

    this.transmitQueue = function () {
        return this.theTransmitQueue;
    };

    this.startUpdateNameListTimer = function () {
        this.updateNameListTimer = window.setInterval(function (session_val) {
            session_val.ajaxObject().getNameList(function (session_val) {
                session_val.runSession();
            }, session_val);
        }, 10000, this);
    };

    this.stopUpdateNameListTimer = function () {
        window.clearInterval(this.updateNameListTimer);
    };

    this.setupClientReceiveCallback = function (callback_func_val, client_val) {
        this.theClientReceiveCallbackFunc = callback_func_val;
        this.theClientObject = client_val;
    };

    this.receiveData = function (str_val) {
        this.clientReceiveCallbackFunc()(this.clientObject(), str_val);
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.transmitData = function () {
        var str;
        while (this.transmitQueue().size() > 0) {
            str = this.transmitQueue().deQueue();
            if (str) {
                //this.logit("transmitData", str);
                this.ajaxObject().postRequest(str, this);
                this.ajaxObject().sendDataToPeer(this, this);
            }
            else {
                this.abend("transmitData", "null data");
            }
        }
    };

    this.runSession = function () {
        var this0 = this;
        var container = this.containerObject();
        this.rootObject().htmlObject().createSessionHolders(this);

        /*
        $(".peer_name_paragraph button").on("click", function() {
            //this0.setHisName($(".peer_main_section select").val());
            //console.log("runCreateSession() ", "peer_name=" + this0.hisName());
            this0.ajaxObject().getNameList(getNameListCallback, container);
        });
        */

        $(".peer_game_paragraph button").on("click", function() {
            this0.setGameName($(".peer_game_paragraph select").val());
            this0.runSession(container);
        });

        $(".peer_connect_section button").on("click", function() {
            this0.setHisName($(".peer_name_paragraph select").val());
            var config = container.configObject();
            if (this0.containerObject().objectName() === "GoContainerObject") {
                config.setBoardSize($(".board_size_section select").val());
                config.setMyColor($(".play_color_section select").val());
                config.setKomiPoint($(".komi_section select").val());
                config.setHandicapPoint($(".handicap_section select").val());
                console.log("runConfig() ", " my_name=" + this0.rootObject().myName() +
                                            " his_name=" + this0.hisName() +
                                            " board_size=" + config.boardSize() +
                                            " color=" + config.myColor() +
                                            " komi=" + config.komiPoint() +
                                            " handicap=" + config.handicapPoint());
            }
            this0.ajaxObject().initiateSessionConnection(function (session_val) {
                session_val.stopUpdateNameListTimer();
                session_val.containerObject().runGoGame();
            }, this0);
        });
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilabend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theXmtSeq = 0;
    this.theRcvSeq = 0;
    this.theSessionId = 0;
    //this.theReceiveQueue = new QueueObject(this.utilObject());
    this.theTransmitQueue = new QueueObject(this.utilObject());
    this.rootObject().sessionMgrObject().enQueue(this);
    this.startUpdateNameListTimer();
}

/*
function getNameListCallback_used_by_update (container_val) {
    console.log("getNameListCallback() " + container_val.objectName());
    container_val.sessionObject().runCreateSession(container_val);
}
*/
