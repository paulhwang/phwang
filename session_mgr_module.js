/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: session_mgr_module.js
 */

var theSessionMgrObject;

module.exports = {
    init: function (root_object_val) {
        theSessionMgrObject = new SessionMgrObject(root_object_val);
    },

    search: function (my_name_val, his_name_val, session_id_val) {
        return theSessionMgrObject.searchIt(my_name_val, his_name_val, session_id_val);
    },

    search_and_create: function (my_name_val, his_name_val, session_id_val) {
        return theSessionMgrObject.searchAndCreate(my_name_val, his_name_val, session_id_val);
    },

    malloc: function (my_name_val, his_name_val) {
         return theSessionMgrObject.mallocIt(my_name_val, his_name_val);
    },

    free: function (entry_val) {
        theSessionMgrObject.freeIt(entry_val);
    },
};

function SessionMgrObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "SessionMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.sessionPoolModule = function () {
        return this.theSessionPoolModule;
    };

    this.sessionQueue = function () {
        return this.theSessionQueue;
    };

    this.searchIt = function (my_name_val, his_name_val, session_id_val) {
        return this.queueModule().search(this.sessionQueue(), compareIt, my_name_val, his_name_val, session_id_val);
    };

    this.searchAndCreate = function (my_name_val, his_name_val, session_id_val) {
        var session = this.queueModule().search(this.sessionQueue(), compareIt, my_name_val, his_name_val, session_id_val);
        if (!session) {
            session = this.sessionPoolModule().malloc(my_name_val, his_name_val);
            this.queueModule().enqueue(this.sessionQueue(), session);
        }
        return session;
    };

    this.mallocIt = function (my_name_val, his_name_val) {
        var acc = this.sessionPoolModule().malloc(my_name_val, his_name_val);
        return acc;
    };

    this.freeIt = function (entry_val) {
    };

    this.abendIt = function () {
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.theSessionPoolModule = require("./session_pool_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theSessionQueue = this.queueModule().malloc();
}

function compareIt (session_val, my_name_val, his_name_val, session_id_val) {
    //console.log("compareIt", my_name_val + ":" + session_val.my_name + " " + his_name_val + ":" + session_val.his_name);
    if ((my_name_val !== session_val.my_name) || (his_name_val !== session_val.his_name)) {
        return false;
    }
    if (session_id_val === -1) {
        return true;
    } else {
        return (session_id_val === session_val.session_id);
    }
}

