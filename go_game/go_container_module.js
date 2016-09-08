/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_container_module.js
 */

module.exports = {
    malloc: function (container_val) {
        return new goContainerObject(container_val);
    },
};

function goContainerObject (container_val) {
    "use strict";
    this.theUtilModule = require("./../util_module.js");
    this.theContainerModule = container_val;

    this.objectName = function () {
        return "goContainerObject";
    };

    this.containerModule = function () {
        return this.theContainerModule;
    };

    this.utilModule = function () {
        return this.theUtilModule;
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

    this.logit(this.objectName(), "bbb");
}
