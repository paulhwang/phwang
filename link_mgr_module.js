/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

module.exports = {
    search: function (my_name_val, link_id_val) {
        return searchLink(my_name_val, link_id_val);
    },

    search_and_create: function (my_name_val, link_id_val) {
        return searchAndCreate(my_name_val, link_id_val);
    },

    remove_link: function (link_val) {
        removeLink(link_val);
    },

    get_name_list: function () {
        return getNameList();
    },

    malloc: function (my_name_val) {
         return mallocIt(my_name_val);
    },

    free: function (entry_val) {
        freeIt(entry_val);
    },
};

var util = require("./util_module.js");
var queue = require("./queue_module.js");
var link_pool = require("./link_pool_module.js");

var link_queue = queue.malloc();

function searchLink(my_name_val, link_id_val) {
    debug(false, "searchIt", my_name_val + " " + link_id_val);
    return queue.search(link_queue, compareLink, my_name_val, link_id_val);
}

function searchAndCreate(my_name_val, link_id_val) {
    var link = queue.search(link_queue, compareLink, my_name_val, link_id_val);
    if (!link) {
        link = link_pool.malloc(my_name_val);
        debug(false, "searchAndCreate", "malloc link: name=" + link.my_name + "=link_id=" + link.link_id);
        queue.enqueue(link_queue, link);
    }
    return link;
}

function compareLink (link_val, my_name_val, link_id_val) {
    debug(false, "compareIt", my_name_val + ":" + link_val.my_name);
    if (my_name_val !== link_val.my_name) {
        return false;
    }
    if (link_id_val === -1) {
        return true;
    } else {
        return (link_id_val === link_val.link_id);
    }
}

function removeLink (link_val) {
    logit("removeLink", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
    queue.remove(link_queue, compareLink, link_val.my_name, link_val.link_id);
}

function getNameList () {
    var queue_element, link, i;
    var name_array = [];

    i = 0;
    queue_element = link_queue.tail;
    while (queue_element) {
        link = queue_element.data;
        name_array[i] = link.my_name;
        i += 1;
        queue_element = queue_element.prev;
    }
    return name_array;
}

function mallocIt(my_name_val) {
    "use strict";
    var acc = link_pool.malloc(my_name_val);
    return acc;
}

function freeIt(entry_val) {
    "use strict";
}

function abendIt() {
}

function debug(debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function abend (str1_val, str2_val) {
    util.utilAbend("LinkMgrModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    util.utilLogit("LinkMgrModule." + str1_val, str2_val);
}

var theLinkMgrObject = new LinkMgrObject();

function LinkMgrObject() {
    "use strict";

    this.objectName = function () {
        return "LinkMgrObject";
    };

    this.utilModule = function () {
        return this.theUtilModile;
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

    this.searchLink = function (my_name_val, link_id_val) {
        this.debug(false, "searchIt", my_name_val + " " + link_id_val);
        return this.queueModule().search(link_queue, compareLink, my_name_val, link_id_val);
    };

    this.searchAndCreate = function (my_name_val, link_id_val) {
        var link = this.queueModule().search(link_queue, compareLink, my_name_val, link_id_val);
        if (!link) {
            link = link_pool.malloc(my_name_val);
            this.debug(false, "searchAndCreate", "malloc link: name=" + link.my_name + "=link_id=" + link.link_id);
            this.queueModule().enqueue(link_queue, link);
        }
        return link;
    };

    this.removeLink = function (link_val) {
        this.logit("removeLink", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
        this.queueModule().remove(link_queue, compareLink, link_val.my_name, link_val.link_id);
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var queue_element = link_queue.tail;
        while (queue_element) {
            var link = queue_element.data;
            name_array[i] = link.my_name;
            i += 1;
            queue_element = queue_element.prev;
        }
        return name_array;
    };

    this.mallocIt = function (my_name_val) {
        var acc = link_pool.malloc(my_name_val);
        return acc;
    };

    this.freeIt = function (entry_val) {
    };

    this.abendIt = function () {
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

    //this.theUtilModile = require("./util_module.js");
    //this.theSessionPoolModule = require("./session_pool_module.js");
    //this.theQueueModule = require("./queue_module.js");
    //this.theSessionQueue = this.queueModule().malloc();
}
