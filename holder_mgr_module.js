/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_mgr_module.js
 */

module.exports = {
};

var util = require("./util_module.js");
var holder_entry = require("./holder_entry_module.js");

function abendIt() {
    "use strict";

    //logit('abendIt', 'before');

    //logit('abendIt', 'succeed');
 }

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("HolderMgrModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("HolderMgrModule." + str1_val, str2_val);
}

