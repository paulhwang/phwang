/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: ring_module.js
 */

var util = require("./util_module.js");
var input = 0;
var output = 0;
var size = 2;
var left = size;
var array = [size];

module.exports = {
    malloc: function () {
        ring = new RingObject();
        ring.input = 0;
        ring.output = 0;
        ring.size = 2;
        ring.left = ring.size;
        ring.array = [ring.size];
        return ring;
    },

    enqueue: function (ring_val, data_val) {
        enQueue(ring_val, data_val);
    },

    dequeue: function (ring_val) {
        return deQueue(ring_val);
    },
};

function RingObject () {
    //var input;
    //var output;
    //var size;
    //ar left;
    //var array;
}

function enQueue (ring_val, data_val) {
    "use strict";

    //logit("enQueue", "start");

    if (ring_val.left < 0) {
        abend("enQueue", "left=" + ring_val.left);
        return;
    }

    if (ring_val.left <= (ring_val.size / 2)) {
        increaseSize(ring_val);
    }

    ring_val.array[ring_val.input] = data_val;
    ring_val.input += 1;
    if (ring_val.input === ring_val.size) {
        ring_val.input = 0;
    }
    ring_val.left -= 1;

    abendIt(ring_val);
}

function deQueue (ring_val) {
    "use strict";

    //logit("deQueue", "start");

    if (ring_val.left === ring_val.size) {
        return null;
    }

    var data = ring_val.array[output];
    ring_val.output += 1;
    if (ring_val.output === ring_val.size) {
        ring_val.output = 0;
    }
    ring_val.left += 1;

    abendIt(ring_val);

    return data;
}

function increaseSize (ring_val) {
    //logit("increaseSize", ring_val.size);

    var i = ring_val.size;
    while (i < ring_val.size * 2) {
        ring_val.array[i] = null;
        i += 1;
    }

    if (ring_val.input < ring_val.output) {
        i = 0;
        while (i <= ring_val.input) {
            ring_val.array[ring_val.size + i] = i;
            i += 1;
        }
        ring_val.input += ring_val.size;
    }

    ring_val.left += ring_val.size;
    ring_val.size *= 2;

    abendIt(ring_val);
}

function abendIt (ring_val) {
    "use strict";

    //logit('abendIt', 'before');
    if (ring_val.left < 0) {
        abend("abendIt", "left=" + ring_val.left);
    }

    if ((ring_val.input + ring_val.left - ring_val.output !== ring_val.size) && (ring_val.input + ring_val.left - ring_val.output !== 0)) {
        abend('abendIt', "input(" + ring_val.input + ") + left(" + ring_val.left + ") - output(" + ring_val.output + ") !== size(" + ring_val.size + ")");
    }
    //logit('abendIt', 'succeed');
}

function abend (str1_val, str2_val) {
    "use strict";
    util.utilAbend("RingModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    "use strict";
    util.utilLogit("RingModule." + str1_val, str2_val);
}
