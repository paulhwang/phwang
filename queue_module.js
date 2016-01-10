/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: queue_module.js
 */

var util = require("./util_module.js");
var holder_pool = require("./holder_pool_module.js");

module.exports = {
    malloc: function () {
        que = new QueueObject();
        que.head = null;
        que.tail = null;
        que.size = 0;
        return que;
    },

    enqueue: function (queue_val, data_val) {
        enQueue(queue_val, data_val);
    },

    dequeue: function (queue_val) {
        return deQueue(queue_val);
    },

    search: function (queue_val, func_val, input_val1, input_val2, input_val3) {
        return searchIt(queue_val, func_val, input_val1, input_val2, input_val3);
    },

};

function QueueObject () {
    //var head;
    //var tail;
    //var size;
}

function enQueue (queue_val, data_val) {
    "use strict";

    if (!queue_val) {
        abend('enqueueIt', 'null queue_val');
        return;
    }

    if (!data_val) {
        abend('enqueueIt', 'null data_val');
        return;
    }

    //logit("enqueueIt", "start");

    abendIt(queue_val);

    var data_entry = holder_pool.malloc(data_val);
    if (!data_entry) {
        abend('enqueueIt', 'null data_entry');
        return;
    }

    queue_val.size += 1;
    if (!queue_val.head) {
        //logit("enqueueIt", "1000");
        data_entry.prev = null;
        data_entry.next = null;
        queue_val.head = data_entry;
        queue_val.tail = data_entry;
    } else {
        //logit("enqueueIt", "2000");
        queue_val.tail.next = data_entry;
        data_entry.prev = queue_val.tail;
        data_entry.next = null;
        queue_val.tail = data_entry;
    }
    abendIt(queue_val);
}

function deQueue (queue_val) {
    "use strict";
    var data_entry;
    var data;

    //logit("deQueue", "start");

    if (!queue_val) {
        return;
    }

    //logit("dequeueIt", "1000");

    abendIt(queue_val);

    if (!queue_val.head) {
        //logit("dequeueIt", "2000");
        data_entry = null;
        data = null;
    } else if (queue_val.head === queue_val.tail) {
        //logit("dequeueIt", "3000");
        queue_val.size -= 1;
        data_entry = queue_val.head;
        data = data_entry.data;
        queue_val.head = null;
        queue_val.tail = null;
    } else {
        //logit("dequeueIt", "4000");
        queue_val.size -= 1;
        data_entry = queue_val.head;
        data = data_entry.data;
        queue_val.head = queue_val.head.next;
        queue_val.head.prev = null;
    }

    //logit("dequeueIt", "5000");

    if (data_entry) {
        //logit("dequeueIt", "data=" + data_entry.data);
        holder_pool.free(data_entry);
    }
    else {
        //logit("dequeueIt", "6000");
    }

    abendIt(queue_val);

    //logit("dequeueIt", "end");
    return data;
}

function searchIt(queue_val, func_val, input_val1, input_val2, input_val3) {
    var p;

    p = queue_val.head;
    while (p) {
        if (func_val(p.data, input_val1, input_val2, input_val3)) {
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

function debug(debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function abend (str1_val, str2_val) {
    util.utilAbend("QueueModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    util.utilLogit("QueueModule." + str1_val, str2_val);
}
