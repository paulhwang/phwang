/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: util_module.js
 */

var userIndex = '0';

module.exports = {
    setIndex: function (index_val) {
        userIndex = index_val;
    },

    logit: function (s1_val, s2_val) {
        console.log(userIndex + s1_val + "() " + s2_val);
    },

    abend: function (s1_val, s2_val) {
        console.log(userIndex + "*********abend**********: " + s1_val + "() " + s2_val);
        //alert("abend: " + s1_val + "() " + s2_val);
        var x = junk;
    }
};
