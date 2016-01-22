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

    object: function () {
        return theSessionMgrObject;
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
        return this.rootObject().queueModule();
    };

    this.sessionModule = function () {
        return this.theSessionModule;
    };

    this.sessionQueue = function () {
        return this.theSessionQueue;
    };

    this.poolHead = function () {
        return this.thePoolHead;
    };

    this.setHead = function (val) {
        this.thePoolHead = val;
    };

    this.globalSessionId = function () {
        return this.theGlobalSessionId;
    };

    this.incrementGlobalSessionId = function () {
        return this.theGlobalSessionId += 1;
    };

    this.poolSize = function () {
        return this.thePoolSize;
    };

    this.incrementPoolSize = function () {
        return this.thePoolSize += 1;
    };

    this.decrementPoolSize = function () {
        return this.thePoolSize -= 1;
    };

    this.searchIt = function (my_name_val, his_name_val, session_id_val) {
        return this.sessionQueue().searchIt(function (session_val, my_name_val, his_name_val, session_id_val) {
            return ((my_name_val === session_val.myName()) &&
                    (his_name_val === session_val.hisName()) &&
                    ((session_id_val === session_val.session_id) || (session_id_val === 0)));
        }, my_name_val, his_name_val, session_id_val);
    };

    this.searchAndCreate = function (my_name_val, his_name_val, session_id_val) {
        var session = this.searchIt(my_name_val, his_name_val, session_id_val);
        if (!session) {
            session = this.mallocIt(my_name_val, his_name_val);
            var his_session = this.mallocIt(his_name_val, my_name_val);
            session.setHisSession(his_session);
            his_session.setHisSession(session);
            this.sessionQueue().enQueue(session);
            this.sessionQueue().enQueue(his_session);
        }
        return session;
    };

    this.mallocIt = function (my_name_val, his_name_val) {
        var entry;

        if (!this.poolHead()) {
            entry = this.sessionModule().malloc(my_name_val, his_name_val, this.globalSessionId());
        } else {
            entry = this.poolHead();
            entry.resetIt(my_name_val, his_name_val, this.globalSessionId());
            this.setHead(entry.next());
            this.decrementPoolSize();
        }
        this.incrementGlobalSessionId();

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        this.incrementPoolSize();
        entry_val.setNext(this.poolHead());
        this.setHead(entry_val);
        this.abendIt();
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.poolHead();
        while (p) {
            p = p.next();
            i += 1;
        }
        if (i !== this.poolSize()) {
            this.abend("abendIt", "size=" + this.poolSize() + " i=" + i);
        }

        if (this.poolSize() > 5) {
            this.abend("abendIt", "size=" + this.poolSize());
        }
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

    this.theSessionModule = require("./session_entry_module.js");
    this.theSessionQueue = this.queueModule().malloc();
    this.theGlobalSessionId = 1000;
    this.thePoolHead = null;
    this.thePoolSize = 0;
}
