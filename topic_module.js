/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: topic_module.js
 */

module.exports = {
    malloc: function (session_val) {
        return new topicObject(session_val);
    },
};

function topicObject (session_val) {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theGoContainerModule = require("./go_game/go_container_module.js")

    this.theSessionObject = session_val;

    this.objectName = function () {
        return "topicObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.goContainerModule = function () {
        return this.theGoContainerModule;
    };

    this.sessionObject = function () {
        return this.theSessionObject;
    };

    this.goContainerObject = function () {
        return this.theGoContainerObject;
    };

    this.debug = function (debug_val, str1_val, str2_val) {
        if (debug_val) {
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilModule().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilModule().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit(this.objectName(), "aaa");

    this.theGoContainerObject = this.goContainerModule().malloc(this);
}
