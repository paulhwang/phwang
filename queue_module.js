/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

module.exports = {
    malloc: function () {
        que = new QueueObject();
        que.head = null;
        que.tail = null;
        que.size = 0;
        return que;
    },

    enqueue: function (queue_val, data_val) {
        enqueueIt(queue_val, data_val);
    },

    dequeue: function (queue_val) {
        return dequeueIt(queue_val);
    },

    search: function (queue_val, input_val, func_val) {
        return searchIt(queue_val, input_val, func_val);
    },

};

var util = require("./util_module.js");
var holder_pool = require("./holder_pool_module.js");
var head = null;
var tail = null;
var size = 0;

function QueueObject () {
    var head;
    var tail;
    var size;
}

function enqueueIt (queue_val, data_val) {
    "use strict";

    //logit("enqueueIt", "start");

    var data_entry = holder_pool.malloc(data_val);
    if (!data_entry) {
        abend('enqueueIt', 'null data_entry');
        return;
    }

    queue_val.size += 1;
    if (!queue_val.head) {
        data_entry.prev = null;
        data_entry.next = null;
        queue_val.head = data_entry;
        queue_val.tail = data_entry;
    } else {
        queue_val.tail.next = data_entry;
        data_entry.prev = queue_val.tail;
        data_entry.next = null;
        queue_val.tail = data_entry;
    }
    abendIt(queue_val);

    //logit("enqueueIt", "end");
}

function dequeueIt (queue_val) {
    "use strict";
    var data_entry;
    var data;

    //logit("dequeueIt", "start");

    if (!queue_val.head) {
        data_entry = null;
        data = null;
    } else if (head === tail) {
        queue_val.size -= 1;
        data_entry = queue_val.head;
        data = data_entry.data;
        queue_val.head = null;
        queue_val.tail = null;
    } else {
        queue_val.size -= 1;
        data_entry = queue_val.head;
        data = data_entry.data;
        queue_val.head = head.next;5
        head.prev = null;
    }

    //logit("dequeueIt", data_entry);
    //logit("dequeueIt", data_entry.data);
    abendIt(queue_val);
    holder_pool.free(data_entry);

    //logit("dequeueIt", "end");
    return data;
}

function searchIt(queue_val, input_val, func_val) {
    var p;

    p = queue_val.head;
    while (p) {
        if (func_val(input_val, p.data)) {
            return p.data;
        }
        p = p.next;
    }
    return null;
}

function abendIt (queue_val) {
    "use strict";
    var i, p;

    //logit("abendIt", "start");

    i = 0;
    p = queue_val.head;
    while (p) {
        p = p.next;
        i += 1;
    }
    if (i !== queue_val.size) {
        abend("abendIt", "head: size=" + queue_val.size + " i=" + i);
    }

    i = 0;
    p = queue_val.tail;
    while (p) {
        p = p.prev;
        i += 1;
    }
    if (i !== queue_val.size) {
        abend("abendIt", "tail: size=" + queue_val.size + " i=" + i);
    }

    //logit("abendIt", "end");
}

function abend (str1_val, str2_val) {
    "use strict";
    util.abend("QueueModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.logit("QueueModule." + str1_val, str2_val);
}
