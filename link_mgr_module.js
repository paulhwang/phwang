/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: link_mgr_module.js
 */

var theLinkMgrObject;

module.exports = {
    init: function (root_object_val) {
        theLinkMgrObject = new LinkMgrObject(root_object_val);
    },

    search: function (my_name_val, link_id_val) {
        return theLinkMgrObject.searchLink(my_name_val, link_id_val);
    },

    search_and_create: function (my_name_val, link_id_val) {
        return theLinkMgrObject.searchAndCreate(my_name_val, link_id_val);
    },

    remove_link: function (link_val) {
        theLinkMgrObject.removeLink(link_val);
    },

    get_name_list: function () {
        return theLinkMgrObject.getNameList();
    },

    malloc: function (my_name_val) {
         return theLinkMgrObject.mallocIt(my_name_val);
    },

    free: function (entry_val) {
        theLinkMgrObject.freeIt(entry_val);
    },
};

function LinkMgrObject(root_object_val) {
    "use strict";
    this.theRootObject = root_object_val;

    this.objectName = function () {
        return "LinkMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.utilModule = function () {
        return this.rootObject().utilModile();
    };

    this.queueModule = function () {
        return this.theQueueModule;
    };

    this.linkPoolModule = function () {
        return this.theLinkPoolModule;
    };

    this.linkQueue = function () {
        return this.theLinkQueue;
    };

    this.searchLink = function (my_name_val, link_id_val) {
        this.debug(false, "searchIt", my_name_val + " " + link_id_val);
        return this.queueModule().search(this.linkQueue(), compareLink, my_name_val, link_id_val);
    };

    this.searchAndCreate = function (my_name_val, link_id_val) {
        var link = this.queueModule().search(this.linkQueue(), compareLink, my_name_val, link_id_val);
        if (!link) {
            link = this.linkPoolModule().malloc(my_name_val);
            this.debug(false, "searchAndCreate", "malloc link: name=" + link.my_name + "=link_id=" + link.link_id);
            this.queueModule().enqueue(this.linkQueue(), link);
        }
        return link;
    };

    this.removeLink = function (link_val) {
        this.logit("removeLink", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
        this.queueModule().remove(this.linkQueue(), compareLink, link_val.my_name, link_val.link_id);
    };

    this.getNameList = function () {
        var name_array = [];
        var i = 0;
        var queue_element = this.linkQueue().tail;
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

    this.theUtilModile = require("./util_module.js");
    this.theLinkPoolModule = require("./link_pool_module.js");
    this.theQueueModule = require("./queue_module.js");
    this.theLinkQueue = this.queueModule().malloc();
}

function compareLink (link_val, my_name_val, link_id_val) {
    //debug(false, "compareIt", my_name_val + ":" + link_val.my_name);
    if (my_name_val !== link_val.my_name) {
        return false;
    }
    if (link_id_val === -1) {
        return true;
    } else {
        return (link_id_val === link_val.link_id);
    }
}
