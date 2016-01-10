/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: SessionEngineObject.js
 */

function SessionEngineObject(root_object_val, session_object_val) {
    "use strict";
    this.theObjectName = "SessionEngineObject";
    this.theRootObject = root_object_val;
    this.theSessionObject = session_object_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.rootObject = function () {
        return this.theRootObject;
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

    this.setupSession = function (session_val) {
        this.ajxObject().setupSession(session_val);
    };

    this.transmitData = function () {
        var session, str;
        while (true) {
            session = this.rootObject().sessionMgrObject().deQueue();
            if (!session) {
                return;
            }
            str = session.transmitQueue().deQueue();
            if (str) {
                //this.logit("transmitData", str);
                this.ajxObject().postMessage(str, session);
                this.ajxObject().getMessage(this, session);
            }
            else {
                this.abend("transmitData", "null data");
            }
        }
    };

    this.receiveStringData = function (str_val) {
        this.sessionObject().receiveData(str_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().Utilabend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };
}

