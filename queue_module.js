/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    malloc: function () {
        que = new QueueObject();
        return que;
    },

    enqueue: function (queue_val, data_val) {
        if (!queue_val) {
            return;
        }
        queue_val.enQueue(data_val);
    },

    dequeue: function (queue_val) {
        return queue_val.deQueue();
    },

    queue_size: function (queue_val) {
        return queue_val.size;
    },

    remove: function (queue_val, func_val, input_val1, input_val2, input_val3) {
        queue_val.removeElement(func_val, input_val1, input_val2, input_val3);
    },

    search: function (queue_val, func_val, input_val1, input_val2, input_val3) {
        return queue_val.searchIt(func_val, input_val1, input_val2, input_val3);
    },
};

function QueueObject () {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theHolderPoolModule = require("./holder_pool_module.js");

    this.objectName = function () {
        return "QueueObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.holderPoolModule = function () {
        return this.theHolderPoolModule;
    };

    this.enQueue = function (data_val) {
        if (!data_val) {
            this.abend("enQueue", "null data_val");
            return;
        }

        this.abendIt();

        var data_entry = this.holderPoolModule().malloc(data_val);
        if (!data_entry) {
            this.abend("enQueue", "null data_entry");
            return;
        }

        this.size += 1;
        if (!this.head) {
            data_entry.prev = null;
            data_entry.next = null;
            this.head = data_entry;
            this.tail = data_entry;
        } else {
            this.tail.next = data_entry;
            data_entry.prev = this.tail;
            data_entry.next = null;
            this.tail = data_entry;
        }
        this.abendIt();
    };

    this.deQueue = function () {
        var data_entry;
        var data;

        this.abendIt();

        if (!this.head) {
            data_entry = null;
            data = null;
        } else if (this.head === this.tail) {
            this.size -= 1;
            data_entry = this.head;
            data = data_entry.data;
            this.head = null;
            this.tail = null;
        } else {
            this.size -= 1;
            data_entry = this.head;
            data = data_entry.data;
            this.head = this.head.next;
            this.head.prev = null;
        }

        if (data_entry) {
            //this.logit("deQueue", "data=" + data_entry.data);
            this.holderPoolModule().free(data_entry);
        }
        else {
            this.logit("deQueue", "null");
        }

        this.abendIt();
        return data;
    };

    this.removeElement = function (func_val, input_val1, input_val2, input_val3) {
        this.abendIt();

        var p = this.head;
        while (p) {
            this.debug(false, "removeElement", "in while loop");
            if (func_val(p.data, input_val1, input_val2, input_val3)) {
                this.debug(false, "removeElement", "found");
                if (p.prev) {
                    p.prev.next = p.next;
                } else {
                    this.head = p.next;
                }
                if (p.next) {
                    p.next.prev = p.prev;
                } else {
                    this.tail = p.prev;
                }
                this.size -= 1;
                return;
            }
            p = p.next;
        }
        this.abendIt();
        this.debug(false, "removeElement", "not found");
    };

    this.searchIt = function (func_val, input_val1, input_val2, input_val3) {
        var p = this.head;
        while (p) {
            this.debug(false, "searchIt", "in while loop");
            if (func_val(p.data, input_val1, input_val2, input_val3)) {
            this.debug(false, "searchIt", "found");
                return p.data;
            }
            p = p.next;
        }
        this.debug(false, "searchIt", "not found");
        return null;
    };

    this.abendIt = function () {
        var i = 0;
        var p = this.head;
        while (p) {
            p = p.next;
            i += 1;
        }
        if (i !== this.size) {
            this.abend("abendIt", "head: size=" + this.size + " i=" + i);
        }

        i = 0;
        p = this.tail;
        while (p) {
            p = p.prev;
            i += 1;
        }
        if (i !== this.size) {
            this.abend("abendIt", "tail: size=" + this.size + " i=" + i);
        }
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

    this.head = null;
    this.tail = null;
    this.size = 0;
}
