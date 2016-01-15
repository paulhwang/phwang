/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_object.js
 */

function QueueObject(util_val) {
    "use strict";
    this.theObjectName = "QueueObject";
    this.theUtilObject = util_val;

    this.objectName = function () {
        return this.theObjectName;
    };

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.holderPoolObject = function () {
        return this.theHolderPoolObject;
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
        return this.theSize += 1;
    };

    this.decrementSize = function () {
        return this.theSize -= 1;
    };

    this.enQueue = function (data_val) {
        if (!data_val) {
            this.abend("enQueue", "null data_val");
            return;
        }

        this.abendIt();

        var data_entry = this.holderPoolObject().mallocEntry(data_val);
        if (!data_entry) {
            this.abend("enQueue", "null data_entry");
            return;
        }

        this.incrementSize();
        if (!this.head()) {
            data_entry.setPrev(null);
            data_entry.setNext(null)
            this.setHead(data_entry);
            this.setTail(data_entry);
        } else {
            this.tail().setNext(data_entry);
            data_entry.setPrev(this.tail());
            data_entry.setNext(null);
            this.setTail(data_entry);
        }
        this.abendIt();
    };

    this.deQueue = function () {
        var data_entry;
        var data;

        this.abendIt();

        if (!this.head()) {
            data_entry = null;
            data = null;
        } else if (this.head() === this.tail()) {
            this.decrementSize();
            data_entry = this.head();
            data = data_entry.data();
            this.setHead(null);
            this.setTail(null);
        } else {
            this.decrementSize();
            data_entry = this.head();
            data = data_entry.data();
            this.setHead(this.head().next());
            this.head().setPrev(null);
        }

        if (data_entry) {
            this.holderPoolObject().freeEntry(data_entry);
        }

        this.abendIt();
        return data;
    };

    this.searchIt = function (input_val, func_val) {
        var p;

        p = this.head();
        while (p) {
            if (func_val(input_val, p.data)) {
                return p.data;
            }
            p = p.next();
        }
        return null;
    };

    this.abendIt = function () {
        var i, p;

        i = 0;
        p = this.head();
        while (p) {
            p = p.next();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "head: size=" + this.size() + " i=" + i);
        }

        i = 0;
        p = this.tail();
        while (p) {
            p = p.prev();
            i += 1;
        }
        if (i !== this.size()) {
            this.abend("abendIt", "tail: size=" + this.size() + " i=" + i);
        }
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit(this.objectName() + "." + str1_val, str2_val);
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.theHead = null;
    this.theTail = null;
    this.theSize = 0;
    this.theHolderPoolObject = new HolderPoolObject(this.utilObject());
}
