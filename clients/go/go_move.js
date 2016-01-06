/*
 * Copyright phwang
 * Written by Paul Hwang
 * File name: go_move.js
 */

"use strict";

function GoMoveObject(str_val, x_val, y_val, color_val, turn_val, container_val) {
    this.objectName = function () {
        return this.theObjectName;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.xX = function () {
        return this.theX;
    };

    this.yY = function () {
        return this.theY;
    };

    this.myColor = function () {
        return this.theMyColor;
    };

    this.turnIndex = function () {
        return this.theTurnIndex;
    };

    this.encodeMove = function () {
        //GO.goLog("GoMoveObject.encodeMove", "");

        var buf = "";
        if (this.xX() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.xX();

        if (this.yY() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.yY();

        buf = buf + this.myColor();

        if (this.turnIndex() < 100) {
            buf = buf + 0;
        }
        if (this.turnIndex() < 10) {
            buf = buf + 0;
        }
        buf = buf + this.turnIndex();

        //this.goLog("encodeMove", "output=" + buf);
        return buf;
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.moveObjectDecode = function (str_val) {
        this.goLog("GoMoveObject", "input=" + str_val);
        var index = 0;
        this.theX = (str_val.charAt(index++) - '0') * 10;
        this.theX += (str_val.charAt(index++) - '0');
        this.theY = (str_val.charAt(index++) - '0') * 10;
        this.theY += (str_val.charAt(index++) - '0');
        this.theMyColor = (str_val.charAt(index++) - '0');
        this.theTurnIndex = (str_val.charAt(index++) - '0') * 100;
        this.theTurnIndex += (str_val.charAt(index++) - '0') * 10;
        this.theTurnIndex += (str_val.charAt(index++) - '0');
   };

   //GO.goLog("GoMoveObject.GoMoveObject", "(" + x_val + "," + y_val + ") color=" + color_val + " turn=" + turn_val);
    this.theObjectName = "GoMoveObject";
    this.theContainerObject = container_val;

    if (!str_val) {
        this.theX = x_val;
        this.theY = y_val;
        this.theMyColor = color_val;
        this.theTurnIndex = turn_val;
    } else {
        this.moveObjectDecode(str_val);
    }

}
