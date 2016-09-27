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

    this.ajaxId = function () {
        return "" + this.sessionId();
    };

    this.setSessionId = function (val) {
        if (this.sessionId()) {
            this.abend("setSessionId", "already exist");
        }
        this.theSessionId = val;
        this.ajaxObject().setupCallback("get_session_data", this.ajaxId(), ajaxGetSessionDataCallback, this);
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
        var this0 = this;
        this.updateNameListTimer = window.setInterval(function (ajax_id_val, session_val) {
            if (!session_val.sessionConnected) {
                session_val.ajaxObject().getNameList(this0.rootObject().ajaxId(), session_val);
            } else {
                //session_val.ajaxObject().getSessionData(ajax_id_val, session_val);
            }
        }, 500, this.ajaxId(), this);
    };

    this.stopUpdateNameListTimer = function () {
        window.clearInterval(this.updateNameListTimer);
    };

    this.setupClientReceiveCallback = function (callback_func_val, client_val) {
        this.theClientReceiveCallbackFunc = callback_func_val;
        this.theClientObject = client_val;
    };

    this.receiveData = function (res_data_val) {
        this.clientReceiveCallbackFunc()(this.clientObject(), res_data_val);
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
                this.ajaxObject().putSessionData (this.ajaxId(), this, str);
                //this.ajaxObject().postRequest(str, this);
                //this.ajaxObject().sendDataToPeer(this, this);
            }
            else {
                this.abend("transmitData", "null data");
            }
        }
    };

    this.startGoGame = function () {
        this.sessionConnected = true;
        this.ajaxObject().getSessionData(this.ajaxId(), this);
        this.containerObject().runGoGame();
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
            this0.ajaxObject().setupCallback(this0.ajaxObject().ajaxSetupSessionCommand(), this0.rootObject().ajaxId(), ajaxSetupSessionCallback, this0);
            var data = JSON.stringify({
                        target: "Go",
                        command: "config",
                        data: JSON.stringify({
                                board_size: config.boardSize(),
                                color: config.hisColor(),
                                komi: config.komiPoint(),
                                handicap: config.handicapPoint(),
                        }),
                    });
            this0.ajaxObject().setupSession(this0.rootObject().ajaxId(), this0, data);
        });
    };

    this.destructor = function () {
        window.clearInterval(this.updateNameListTimer);
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (!debug_val) {
            return;
        }
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val + "==", str2_val);
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
    this.sessionConnected = false;
    //this.theReceiveQueue = new QueueObject(this.utilObject());
    this.theTransmitQueue = new QueueObject(this.utilObject());
    this.rootObject().sessionMgrObject().enQueue(this);
    this.startUpdateNameListTimer();
}

function ajaxGetSessionDataCallback (data_val, res_data_val, session_val) {
    if (res_data_val) {
        session_val.debug(true, "ajaxGetSessionDataCallback", "res_data=" + res_data_val);
        session_val.receiveData(res_data_val);
    }
    session_val.ajaxObject().getSessionData(session_val.ajaxId(), session_val);
}

function ajaxSetupSessionCallback (data_val, res_data_val, session_val) {
    //session_val.logit("ajaxSetupSessionCallback", "data=" + data_val);
    if (!data_val) {
        return;
    }
    var data = JSON.parse(data_val);
    session_val.setSessionId(Number(data.session_id));
    session_val.logit("ajaxSetupSessionCallback", "session_id=" + session_val.sessionId() + " extra=" + data.extra_data);
    session_val.startGoGame();
}
