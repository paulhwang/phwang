/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: holder_pool.js
 */

function HolderPoolObject(util_val) {
    "use strict";
    this.theUtilObject = util_val;

    this.objectName = function () {
        return "HolderPoolObject";
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
            entry.setData(data_val);
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
