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
    this.theLinkModule = require("./link_entry_module.js");

    this.objectName = function () {
        return "LinkMgrObject";
    };

    this.rootObject = function () {
        return this.theRootObject;
    };

    this.linkModule = function () {
        return this.theLinkModule;
    };

    this.utilObject = function () {
        return this.rootObject().utilObject();
    };

    this.queueModule = function () {
        return this.rootObject().queueModule();
    };

    this.linkQueue = function () {
        return this.theLinkQueue;
    };

    this.poolHead = function () {
        return this.thePoolHead;
    };

    this.setPoolHead = function (val) {
        this.thePoolHead = val;
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

    this.searchLink = function (my_name_val, link_id_val) {
        this.debug(false, "searchIt", my_name_val + " " + link_id_val);
        return this.linkQueue().searchIt(compareLink, my_name_val, link_id_val);
    };

    this.searchAndCreate = function (my_name_val, link_id_val) {
        var link = this.searchLink(my_name_val, link_id_val);
        if (!link) {
            link = this.mallocIt(my_name_val);
            this.debug(false, "searchAndCreate", "malloc link: name=" + link.my_name + "=link_id=" + link.link_id);
            this.linkQueue().enQueue(link);
        }
        return link;
    };

    this.removeLink = function (link_val) {
        this.logit("removeLink", "my_name=" + link_val.my_name + " link_id=" + link_val.link_id);
        this.linkQueue().removeElement(compareLink, link_val.my_name, link_val.link_id);
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
        var entry;
        if (!this.poolHead()) {
            entry = this.linkModule().malloc(my_name_val);
        } else {
            entry = this.poolHead();
            this.linkModule().reset(entry, my_name_val);
            this.setHead(entry.next);
            this.decrementPoolSize();
        }

        this.abendIt();
        return entry;
    };

    this.freeIt = function (entry_val) {
        this.incrementPoolSize();
        entry_val.next = this.poolHead();
        this.setHead(entry_val);
        this.abendIt();
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.poolHead();
        while (p) {
            p = p.next;
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
            this.logit(str1_val, "==" + str2_val);
        }
    };

    this.abend = function (str1_val, str2_val) {
        this.utilObject().abend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        this.utilObject().logit(this.objectName() + "." + str1_val, str2_val);
    };

    this.thePoolHead = null;
    this.thePoolSize = 0;
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
