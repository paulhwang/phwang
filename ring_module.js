/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: ring_module.js
 */

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

    enqueue: function (data_val) {
        enqueueIt(data_val);
    },

    dequeue: function () {
        return dequeueIt();
    },
};

var util = require("./util_module.js");
var input = 0;
var output = 0;
var size = 2;
var left = size;
var array = [size];

function RingObject () {
    var input;
    var output;
    var size;
    var left;
    var array;
}

function enqueueIt (data_val) {
    "use strict";

    if (left < 0) {
        abend("enqueueIt", "left=" + left);
        return;
    }

    if (left <= (size / 2)) {
        increaseSize();
    }

    array[input] = data_val;
    input += 1;
    if (input === size) {
        input = 0;
    }
    left -= 1;

    abendIt();
}

function dequeueIt () {
    "use strict";

    if (left === size) {
        return null;
    }

    var data = array[output];
    output += 1;
    if (output === size) {
        output = 0;
    }
    left += 1;
    abendIt();

    return data;
}

function increaseSize () {
    logit("increaseSize", size);

    var i = size;
    while (i < size * 2) {
        array[i] = null;
        i += 1;
    }

    if (input < output) {
        i = 0;
        while (i <= input) {
            array[size + i] = i;
            i += 1;
        }
        input += size;
    }

    left += size;
    size *= 2;
}

function abendIt () {
    "use strict";

    //logit('abendIt', 'before');
    if (left < 0) {
        abend("abendIt", "left=" + left);
    }

    if ((input + left - output !== size) && (input + left - output !== 0)) {
        abend('abendIt', "input(" + input + ") + left(" + left + ") - output(" + output + ") !== size(" + size + ")");
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
