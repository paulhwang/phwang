/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: root.js
 */

function RootObject() {
    "use strict";

    this.utilObject = function () {
        return this.theUtilObject;
    };

    this.theUtilObject = new UtilObject();
}
