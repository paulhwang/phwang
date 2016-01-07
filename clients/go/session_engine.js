/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionEngineObject.js
 */

function SessionEngineObject(root_object_val, port_object_val, session_object_val) {
    "use strict";
    this.theObjectName = "SessionEngineObject";
    this.theRootObject = root_object_val;
    this.thePortObject = port_object_val;
    this.theSessionObject = session_object_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.portObject = function () {
        return this.thePortObject;
    };

    this.sessionObject = function () {
        return this.theSessionObject;
    };

    this.containerObject = function () {
        return this.portObject().containerObject();
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.ajxObject = function () {
        return this.rootObject().ajxObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.containerObject2 = function () {
        return this.containerObject().containerObject2();
    };

    this.httpGetRequest = function () {
        return this.theHttpGetRequest;
    };

    this.httpPostRequest = function () {
        return this.theHttpPostRequest;
    };

    this.ajxRoute = function () {
        return "/go_msg";
    };

    this.transmitStringData = function (str_val) {
        //GO.goLog("SessionMgrObject.transmitStringData", str_val);
        if (this.configObject().playBothSides()) {
            //this.receiveStringData(str_val);
            if (this.ajxObject()) {
                this.ajxObject().postMessage(this.httpPostRequest(), this.ajxRoute(), this.ajxObject().jsonContext(), str_val, this.configObject().opponentName());
                this.ajxObject().getMessage(this.httpGetRequest(), this.ajxRoute(), this.ajxObject().jsonContext(), this, this.configObject().myName());
             }
            return;
        }

        if (this.containerObject2()) {
            if (this.containerObject2().portObject()) {
                this.containerObject2().portObject().sessionEngineObject().receiveStringData(str_val);
                return;
            }
        }
    };

    this.receiveStringData = function (str_val) {
        //GO.goLog("SessionMgrObject.receiveStringData", str_val);

        //this.sessionObject().receiveQueue().enQueue(str_val);
        //str_val = this.sessionObject().receiveQueue().deQueue();
        this.sessionObject().receiveData(str_val);
        //this.sessionObject().theReceiveFunction(this.sessionObject().targetReceiveObject(), str_val);

        //this.portObject().receiveStringData(str_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theHttpGetRequest = this.ajxObject().newHttpRequest();
    this.theHttpPostRequest = this.ajxObject().newHttpRequest();
}
