/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_pool_module.js
 */

var theHolderPoolObject;

module.exports = {
    init: function (util_val) {
        theHolderPoolObject = new HolderPoolObject(util_val);
        return theHolderPoolObject;
    },

    malloc: function (data_val) {
         return mallocEntry(data_val);
    },

    free: function (entry_val) {
        freeEntry(entry_val);
    },
};

var util = require("./util_module.js");
var holder_entry = require("./holder_entry_module.js");
var head = null;
var size = 0;

function mallocEntry(data_val) {
    "use strict";
    var entry;

    abendIt("mallocEntry start");

    if (!head) {
        entry = holder_entry.malloc();
    } else {
        entry = head;
        head = entry.next;
        size -= 1;
    }

    abendIt("mallocEntry end");

    if (entry) {
        entry.data = data_val;
    } else {
        abend('mallocEntry', 'null');
    }

    return entry;
}

function freeEntry(entry_val) {
    "use strict";

    abendIt("freeEntry start");
    if (!entry_val) {
        return;
    }

    abendIt("freeEntry 1000");
    size += 1;
    entry_val.next = head;
    head = entry_val;

    abendIt("freeEntry end" + size);
    abendIt("freeEntry end");
}

function abendIt(val) {
    "use strict";
    var i, p;

    //logit('abendIt', 'before');

    i = 0;
    p = head;
    while (p) {
        p = p.next;
        i += 1;
    }
    if (i !== size) {
        abend("abendIt", val + "size=" + size + " i=" + i);
    }

    if (size > 5) {
         abend("abendIt", val + " size=" + size);
    }

    //logit('abendIt', 'succeed');
 }

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("HolderPoolModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("HolderPoolModule." + str1_val, str2_val);
}

function HolderPoolObject(util_val) {
    "use strict";
    this.theObjectName = "HolderPoolObject";
    this.theUtilObject = util_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.head = function () {
        return this.theHead;
    };

    this.setHead = function (val) {
        this.theHead = val;
    };

    this.tail = function () {
        return this.theTail;
    };


    this.setTail = function (val) {
        this.theTail = val;
    };

    this.size = function () {
        return this.theSize;
    };

    this.incrementSize = function () {
        this.theSize += 1;
    };

    this.decrementSize = function () {
        this.theSize -= 1;
    };

    this.mallocEntry = function (data_val) {
        var entry;

        this.abendIt("mallocEntry start");

        if (!this.head()) {
            entry = new HolderEntryObject();
        } else {
            entry = this.head();
            this.setHead(entry.next());
            this.decrementSize();
        }

        this.abendIt("mallocEntry end");

        if (entry) {
            entry.data = data_val;
        } else {
            this.abend('mallocEntry', 'null');
        }

        return entry;
    };

    this.freeEntry = function(entry_val) {
        this.abendIt("freeEntry start");

        if (!entry_val) {
            return;
        }

        this.abendIt("freeEntry 1000");

        this.incrementSize();
        entry_val.setNext(this.head());
        this.setHead(entry_val);

        this.abendIt("freeEntry end " + this.size());
    };

    this.abendIt = function (val) {
        var i, p;

        i = 0;
        p = this.head();
        while (p) {
            p = p.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", val + "size=" + this.size() + " i=" + i);
        }

        if (this.size() > 5) {
            this.abend("abendIt", val + " size=" + this.size());
        }
    };

    this.logit = function (s1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (s1_val, str2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theHead = null;
    this.theSize = 0;
}
