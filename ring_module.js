/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: ring_module.js
 */

var util = require("./util_module.js");

module.exports = {
    malloc: function () {
        ring1 = new RingObject();

        ring = new RingObject1();
        ring.input = 0;
        ring.output = 0;
        ring.size = 2;
        ring.left = ring.size;
        ring.array = [ring.size];
        return ring1;

    },

    enqueue: function (ring_val, data_val) {
        //enQueue(ring_val, data_val);
        ring1.enQueue(data_val);
    },

    dequeue: function (ring_val) {
        return ring1.deQueue();
        //return deQueue(ring_val);
    },
};
var ring1;

function RingObject1 () {
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

    var data = ring_val.array[ring_val.output];
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

function debug(debug_val, str1_val, str2_val) {
    if (debug_val) {
        logit(str1_val, "==" + str2_val);
    }
}

function abend (str1_val, str2_val) {
    util.utilAbend("RingModule." + str1_val, str2_val);
}

function logit (str1_val, str2_val) {
    util.utilLogit("RingModule." + str1_val, str2_val);
}

function RingObject () {
    "use strict";
    this.theUtilModule = require("./util_module.js");
    this.theHolderPoolModule = require("./holder_pool_module.js");

    this.objectName = function () {
        return "RingObject";
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.holderPoolModule = function () {
        return this.theHolderPoolModule;
    };

    this.input = function () {
        return this.theInput;
    }

    this.setInput = function (val) {
        this.theInput = val;
    }

    this.incrementInput = function (val) {
        this.theInput += 1;
    }

    this.output = function () {
        return this.theOutput;
    }

    this.setOutput = function (val) {
        this.theOutput = val;
    }

    this.incrementOutput = function (val) {
        this.theOutput += 1;
    }

    this.size = function () {
        return this.theSize;
    }

    this.setSize = function (val) {
        this.theSize = val;
    }

    this.incrementSize = function () {
        this.theSize += 1;
    }

    this.decrementSize = function () {
        this.theSize -= 1;
    }

    this.left = function () {
        return this.theLeft;
    }

    this.setLeft = function (val) {
        this.theLeft = val;
    }

    this.array = function (index_val) {
        return this.theArray[index_val];
    }

    this.setArray = function (index_val, data_val) {
        this.theArray[index_val] = data_val;
    }

    this.incrementLeft = function () {
        this.theLeft += 1;
    }

    this.decrementLeft = function () {
        this.theLeft -= 1;
    }

    this.enQueue = function (data_val) {
        if (this.left() < 0) {
            this.abend("enQueue", "left=" + this.left());
            return;
        }

        if (this.left() <= (this.size() / 2)) {
            this.enlargeSize();
        }

        this.setArray(this.input(), data_val);
        this.incrementInput();
        if (this.input() === this.size()) {
            this.setInput(0);
        }
        this.decrementLeft();

        this.abendIt();
    };

    this.deQueue = function () {
        if (this.left() === this.size()) {
            return null;
        }

        var data = this.array(this.output());
        this.incrementOutput();
        if (this.output() === this.size()) {
            this.setOutput(0);
        }
        this.incrementLeft();

        this.abendIt();

        return data;
    };

    this.removeElement = function (func_val, input_val1, input_val2, input_val3) {
    };

    this.searchIt = function (func_val, input_val1, input_val2, input_val3) {
    };

    this.enlargeSize = function () {
        this.logit("enlargeSize", "size=" + this.size());

        var i = this.size();
        while (i < this.size() * 2) {
            this.setArray(i, null);
            i += 1;
        }

        if (this.input() < this.output()) {
            i = 0;
            while (i <= this.input()) {
                this.setArray(this.size() + i, i);
                i += 1;
            }
            this.input += this.size();
        }

        this.setLeft(this.left() + this.size());
        this.setSize(this.size() * 2);

        this.abendIt();
    };

    this.abendIt = function () {
        if (this.left() < 0) {
            this.abend("abendIt", "left=" + this.left());
        }

        if ((this.input() + this.left() - this.output() !== this.size()) && (this.input() + this.left() - this.output() !== 0)) {
            this.abend('abendIt', "input(" + this.input() + ") + left(" + this.left() + ") - output(" + this.output() + ") !== size(" + this.size() + ")");
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

    this.theInput = 0;
    this.theOutput = 0;
    this.theSize = 2;
    this.theLeft = this.size();
    this.theArray = [this.size()];
}
