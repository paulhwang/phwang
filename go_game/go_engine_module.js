/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_engine_module.js
 */

module.exports = {
    malloc: function (container_val) {
        return new GoEngineObject(container_val);
    },
};

function GoEngineObject(container_object_val) {
    "use strict";
    this.theUtilModule = require("./../util_module.js");
    this.theGoDefineModule = require("./go_define_module.js");
    this.theContainerModule = require("./go_container_module.js");
    this.theGroupListModule = require("./go_group_list_module.js");
    this.theGroupModule = require("./go_group_module.js");


    this.objectName = function () {
        return this.theObjectName;
    };

    this.utilModule = function () {
        return this.theUtilModule;
    };

    this.GO = function () {
        return this.theGoDefineModule;
    };

    this.containerModule = function () {
        return this.theContainerModule;
    };

    this.groupListModule = function () {
        return this.theGroupListModule;
    };

    this.groupModule = function () {
        return this.theGroupModule;
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.boardSize = function () {
        return this.configObject().boardSize();
    };

    this.groupListArray = function (index_val) {
        return this.theGroupListArray[index_val];
    };

    this.resetMarkedGroupLists = function () {
        this.theGroupListArray[3] = this.groupListModule().malloc(this, 3, this.GO().BLACK_STONE(), true, "black", "gray");
        this.theGroupListArray[4] = this.groupListModule().malloc(this, 4, this.GO().WHITE_STONE(), true, "white", "gray");
        this.boardObject().resetMarkedBoardObjectData();
   };

    this.resetEmptyGroupLists = function () {
        this.theGroupListArray[0] = this.groupListModule().malloc(this, 0, this.GO().EMPTY_STONE(), false, null, null);
        this.theGroupListArray[5] = this.groupListModule().malloc(this, 5, this.GO().EMPTY_STONE(), false, null, "black");
        this.theGroupListArray[6] = this.groupListModule().malloc(this, 6, this.GO().EMPTY_STONE(), false, null, "white");
   };

    this.emptyGroupList = function () {
        return this.theGroupListArray[0];
    };

    this.blackGroupList = function () {
        return this.theGroupListArray[1];
    };

    this.whiteGroupList = function () {
        return this.theGroupListArray[2];
    };

    this.blackDeadGroupList = function () {
        return this.theGroupListArray[3];
    };

    this.whiteDeadGroupList = function () {
        return this.theGroupListArray[4];
    };

    this.blackEmptyGroupList = function () {
        return this.theGroupListArray[5];
    };

    this.whiteEmptyGroupList = function () {
        return this.theGroupListArray[6];
    };

    this.boardArray = function () {
        return this.boardObject().boardArray();
    };

    this.captureCount = function () {
        return this.theCaptureCount;
    };

    this.setCaptureCount = function () {
        this.theCaptureCount = "";
        if (this.blackCaptureStones() < 100) {
           this.theCaptureCount = this.theCaptureCount + 0;
        }
        if (this.blackCaptureStones() < 10) {
           this.theCaptureCount = this.theCaptureCount + 0;
        }
        this.theCaptureCount = this.theCaptureCount + this.blackCaptureStones();

        if (this.whiteCaptureStones() < 100) {
            this.theCaptureCount = this.theCaptureCount + 0;
        }
        if (this.whiteCaptureStones() < 10) {
            this.theCaptureCount = this.theCaptureCount + 0;
        }
        this.theCaptureCount = this.theCaptureCount + this.whiteCaptureStones();
    };

    this.clearCaptureCount = function () {
        this.theCaptureCount = null;
    };

    this.lastDeadStone = function () {
        return this.theLastDeadStone;
    };

    this.setLastDeadStone = function (x_val, y_val) {
        this.theLastDeadStone = "";
        if (x_val < 10) {
           this.theLastDeadStone = this.theLastDeadStone + 0;
        }
        this.theLastDeadStone = this.theLastDeadStone + x_val;

        if (y_val < 10) {
            this.theLastDeadStone = this.theLastDeadStone + 0;
        }
        this.theLastDeadStone = this.theLastDeadStone + y_val;
    };

    this.clearLastDeadStone = function () {
        this.theLastDeadStone = null;
    };

    this.blackLandScore = function () {
        return this.blackEmptyGroupList().totalStoneCount();
    };

    this.whiteLandScore = function () {
        return this.whiteEmptyGroupList().totalStoneCount();
   };

    this.blackCaptureStones = function () {
        return this.theBlackCaptureStones;
    };

    this.whiteCaptureStones = function () {
        return this.theWhiteCaptureStones;
    };

    this.addBlackCaptureStones = function (count_val) {
        this.theBlackCaptureStones += count_val;
        this.setCaptureCount();
    };

    this.addWhiteCaptureStones = function (count_val) {
        this.theWhiteCaptureStones += count_val;
        this.setCaptureCount();
    };

    this.blackScore = function () {
        return this.blackLandScore() + this.blackCaptureStones()
                + this.whiteDeadGroupList().totalStoneCount() * 2;
    };

    this.whiteScore = function () {
        return this.whiteLandScore() + this.whiteCaptureStones()
                + this.blackDeadGroupList().totalStoneCount() * 2 + this.configObject().realKomiPoint();
    };

    this.finalScoreString = function () {
        if (this.whiteScore() > this.blackScore()) {
            return "white wins by " + (this.whiteScore() - this.blackScore());
        } else {
            return "Black wins by " + (this.blackScore() - this.whiteScore());
        }
    };

    this.blackScoreString = function () {
        if (!this.gameObject().gameIsOver()) {
            return "Black: " + this.blackCaptureStones();
        }
        else {
            return "Black: " + this.blackScore() + " ("
                    + this.blackCaptureStones() + " + "
                    + this.blackLandScore() + " + "
                    + this.whiteDeadGroupList().totalStoneCount() + " x 2)";
        }
    };

    this.whiteScoreString = function () {
        if (!this.gameObject().gameIsOver()) {
            return "White: " + this.whiteCaptureStones();
        }
        else {
            return "White: " + this.whiteScore() + " ("
                    + this.whiteCaptureStones() + " + "
                    + this.whiteLandScore() + " + "
                    + this.blackDeadGroupList().totalStoneCount() + " x 2"
                    + this.configObject().realKomiPoint() + ")";
        }
    };

    this.enterWar = function (move_val) {
        this.goLog("goEnterWar", "(" + move_val.xX() + "," + move_val.yY() + ") color=" + move_val.myColor() + " turn=" + move_val.turnIndex());

        var group = this.insertStoneToGroupList(move_val);
        this.boardObject().addStoneToBoard(move_val.xX(), move_val.yY(), move_val.myColor());
        var dead_count = this.killOtherColorGroups(move_val, group);
        this.goLog("goEnterWar", "dead_count=" + dead_count);

        if (!group.groupHasAir()) {
            this.removeDeadGroup(group);
        }

        if (dead_count !== 0) {
            if (move_val.myColor() === this.GO().BLACK_STONE()) {
                this.addBlackCaptureStones(dead_count);
            } else if (move_val.myColor() === this.GO().WHITE_STONE()) {
               this.addWhiteCaptureStones(dead_count);
            } else {
                this.goAbend("enterWar", "color=" + move_val.myColor());
            }
        }
        this.abendEngine();
    };

    this.insertStoneToGroupList = function (move_val) {
        var g_list;

        if (move_val.myColor() === this.GO().BLACK_STONE()) {
            g_list = this.blackGroupList();
        } else if (move_val.myColor() === this.GO().WHITE_STONE()) {
            g_list = this.whiteGroupList();
        } else {
            this.goAbend("insertStoneToGroupList", "color=" + move_val.myColor());
        }

        var group = g_list.findCandidateGroup(move_val.xX(), move_val.yY());
        if (!group) {
            group = this.groupModule().malloc(g_list);
            group.insertStoneToGroup(move_val.xX(), move_val.yY(), false);
            g_list.insertGroupToGroupList(group);
            //g_list.printGroupList();
            return group;
        }

        group.insertStoneToGroup(move_val.xX(), move_val.yY(), false);
        //g_list.printGroupList();

        var dummy_count = 0;
        var group2;
        while (true) {
            group2 = g_list.findOtherCandidateGroup(group, move_val.xX(), move_val.yY());
            if (!group2) {
                break;
            }
            dummy_count += 1;

            group.mergeWithOtherGroup(group2);

            g_list.removeGroupFromGroupList(group2);
        }
        if (dummy_count > 3) {
            this.goAbend("insertStoneToGroupList", "dummy_count");
        }
        return group;
    };

    this.killOtherColorGroups = function (move_val, group_val) {
        var count;
        this.clearLastDeadStone();
        count = this.killOtherColorGroup(group_val, move_val.xX() - 1, move_val.yY());
        count += this.killOtherColorGroup(group_val, move_val.xX() + 1, move_val.yY());
        count += this.killOtherColorGroup(group_val, move_val.xX(), move_val.yY() - 1);
        count += this.killOtherColorGroup(group_val, move_val.xX(), move_val.yY() + 1);
        return count;
    };

    this.killOtherColorGroup = function (group, x, y) {
        var his_group;

        if (!this.GO().isValidCoordinates(x, y, this.configObject().boardSize())) {
            return 0;
        }

        if (this.boardObject().boardArray(x, y) !== group.hisColor()) {
            return 0;
        }

        his_group = this.getGroupByCoordinate(x, y, group.hisColor());
        if (!his_group) {
            this.goAbend("killOtherColorGroup", "x=" + x + " y=" + y);
            return 0;
        }

        if (his_group.groupHasAir()) {
            return 0;
        }

        var dead_count = his_group.stoneCount();

        if ((group.stoneCount() === 1) && (his_group.stoneCount() === 1)) {
            this.markLastDeadInfo(his_group);
        }

        this.removeDeadGroup(his_group);
        return dead_count;
    };

    this.removeDeadGroup = function (group) {
        group.removeDeadStoneFromBoard();
        if (group.myColor() === this.GO().BLACK_STONE()) {
            this.blackGroupList().removeOneDeadGroup(group);
        } else {
            this.whiteGroupList().removeOneDeadGroup(group);
        }
    };

    this.markLastDeadInfo = function (group_val) {
        this.setLastDeadStone(group_val.maxX(), group_val.maxY());

        if (group_val.maxX() !== group_val.minX()) {
            this.goAbend("markLastDeadInfo", "x: " + group_val.maxX() + "!=" + group_val.minX() + " count=" + group_val.stoneCount());
        }
        if (group_val.maxY() !== group_val.minY()) {
            this.goAbend("markLastDeadInfo", "y: " + group_val.maxY() + "!=" + group_val.minY() + " count=" + group_val.stoneCount());
        }
        if (!group_val.existMatrix(group_val.maxX(), group_val.maxY())) {
            this.goAbend("markLastDeadInfo", "exist_matrix");
        }
    };

    this.isValidMoveOnBoard = function (x_val, y_val) {
        if (this.boardObject().boardArray(x_val, y_val) !== this.GO().EMPTY_STONE()) {
            return false;
        }

        if (this.validLastDeadInfo() && (x_val === this.lastDeadX()) && (y_val === this.lastDeadY())) {
            return false;
        }

        return true;
    };

    this.getGroupByCoordinate = function (x_val, y_val, color_val) {
        //goDebug("GoEngineObject.getGroupByCoordinate", color_val);
        var g_list;
        if ((color_val === this.GO().BLACK_STONE()) || (color_val === this.GO().MARKED_DEAD_BLACK_STONE())) {
            g_list = this.blackGroupList();
        } else {
            g_list = this.whiteGroupList();
        }

        //goDebug("GoEngineObject.getGroupByCoordinate", "groupCount=" + g_list.groupCount());
        var i = 0;
        while (i < g_list.groupCount()) {
            //goDebug("GoEngineObject.getGroupByCoordinate", "i=" + i);
            if (g_list.listArray(i).existMatrix(x_val, y_val)) {
                //goDebug("GoEngineObject.getGroupByCoordinate", "i=" + i);
                return g_list.listArray(i);
            }
            i += 1;
        }

        return null;
    };

    this.stoneHasAir = function (x_val, y_val) {
        if (this.boardObject().isEmptySpace(x_val, y_val - 1)) {
            return true;
        }
        if (this.boardObject().isEmptySpace(x_val, y_val + 1)) {
            return true;
        }
        if (this.boardObject().isEmptySpace(x_val - 1, y_val)) {
            return true;
        }
        if (this.boardObject().isEmptySpace(x_val + 1, y_val)) {
            return true;
        }
        return false;
    };

    this.markDeadGroup = function (x_val, y_val) {
        if (this.boardObject().boardArray(x_val, y_val) === this.GO().EMPTY_STONE()) {
            return;
        }

        var group = this.getMarkGroupByCoordinate(x_val, y_val);
        if (!group) {
            this.goAbend("markDeadGroup", "not found");
            return;
        }

        if (group.groupListObject() === this.blackGroupList()) {
            this.goLog("GoEngineObject.markDeadGroup", "black");
            this.blackGroupList().removeGroupFromGroupList(group);
            this.blackDeadGroupList().insertGroupToGroupList(group);
            group.changeMarkInGroup(true);
        } else if (group.groupListObject() === this.whiteGroupList()) {
            this.goLog("GoEngineObject.markDeadGroup", "white");
            this.whiteGroupList().removeGroupFromGroupList(group);
            this.whiteDeadGroupList().insertGroupToGroupList(group);
            group.changeMarkInGroup(true);
        } else if (group.groupListObject() === this.blackDeadGroupList()) {
            this.goLog("GoEngineObject.markDeadGroup", "dead black");
            this.blackDeadGroupList().removeGroupFromGroupList(group);
            this.blackGroupList().insertGroupToGroupList(group);
            group.changeMarkInGroup(false);
        } else if (group.groupListObject() === this.whiteDeadGroupList()) {
            this.goLog("GoEngineObject.markDeadGroup", "dead white");
            this.whiteDeadGroupList().removeGroupFromGroupList(group);
            this.blackGroupList().insertGroupToGroupList(group);
            group.changeMarkInGroup(false);
        } else {
            this.goAbend("markDeadGroup", "not found 2");
            return;
        }

        this.computeScore();
        /*
    return;
    if (group != null) {
        for (var i = group.xMin_(); i <= group.xMax_(); i++) {
            for (var j = group.yMin_(); j <= group.yMax_(); j++) {
                if (group.existMatrix_1(i, j)) {
                    if (this.boardObject().boardArray_1(i, j) & GO.MARK_DEAD_STONE_DIFF) {
                        this.boardObject().boardArray__(i, j,  this.boardObject().boardArray_1(i, j) - GO.MARK_DEAD_STONE_DIFF);
                        //GO.goLog("GoEngineObject.markDeadGroup", "(" + i + "," + j + ")=" + this.boardObject().boardArray_1(i, j));
                    }
                    else {
                        this.boardObject().boardArray__(i, j,  this.boardObject().boardArray_1(i, j) + GO.MARK_DEAD_STONE_DIFF);
                        //GO.goLog("GoEngineObject.markDeadGroup", "(" + i + "," + j + ")=" + this.boardObject().boardArray_1(i, j));
                    }
                }
            }
        }
    }
    */
    };

    this.getMarkGroupByCoordinate = function (x_val, y_val) {
        this.goLog("getMarkGroupByCoordinate", "");
        var i;

        var g_list;
        g_list = this.blackGroupList();
        i = 0;
        while (i < g_list.groupCount()) {
            if (g_list.listArray(i).existMatrix(x_val, y_val)) {
                this.goLog("getMarkGroupByCoordinate", "black");
                return g_list.listArray(i);
            }
            i += 1;
        }

        g_list = this.whiteGroupList();
        i = 0;
        while (i < g_list.groupCount()) {
            if (g_list.listArray(i).existMatrix(x_val, y_val)) {
                this.goLog("getMarkGroupByCoordinate", "white");
                return g_list.listArray(i);
            }
            i += 1;
        }

        g_list = this.blackDeadGroupList();
        i = 0;
        while (i < g_list.groupCount()) {
            if (g_list.listArray(i).existMatrix(x_val, y_val)) {
                this.goLog("getMarkGroupByCoordinate", "dead_black");
                return g_list.listArray(i);
            }
            i += 1;
        }

        g_list = this.whiteDeadGroupList();
        i = 0;
        while (i < g_list.groupCount()) {
            if (g_list.listArray(i).existMatrix(x_val, y_val)) {
                this.goLog("getMarkGroupByCoordinate", "dead_white");
                return g_list.listArray(i);
            }
            i += 1;
        }

        this.goAbend("getMarkGroupByCoordinate", "not found");
        return null;
    };

    this.computeScore = function () {
        var i;
        this.setupEmptyGroups();
        this.scoreEmptyGroups();

        /* count the score empty area */
        /*
        i = 0;
        for (var i = 0; i < this.emptyGroupList_().group_count; i++) {
              var group1 = this.emptyGroupList_().group_list[i];
              if (group1.score_color == GO.BLACK_STONE) {
                this.blackScore_() += group1.stone_count;
              }
              else if (group1.score_color == GO.WHITE_STONE) {
                this.whiteScore_() += group1.stone_count;
              }
              this.goLog("computeScore", " " + this.white_score + " " + this.black_score);
        }

        i = 0;
        for (var i = 0; i < this.blackGroupList_().groupCount(); i++) {
            var group1 = this.blackGroupList_().listArray_1(i);
              if (group1.marked_as_dead) {
                this.whiteScore_() += group1.stone_count;
              }
        }

        i = 0;
        for (var i = 0; i < this.whiteGroupList_().groupCount(); i++) {
              var group1 = this.whiteGroupList_().listArray_1(i);
              if (group1.marked_as_dead) {
                this.blackScore_() += group1.stone_count;
              }
        }
        */
    };

    this.setupEmptyGroups = function () {
        var i, j;

        this.resetEmptyGroupLists();
        for (i = 0; i < this.boardSize(); i++) {
            for (j = 0; j < this.boardSize(); j++) {
                if (this.boardObject().boardArray(i, j) === this.GO().EMPTY_STONE()) {
                    if (!this.emptyGroupList().stoneExistInGroupList(i, j)) {
                        this.emptyGroupList().insertStoneToEmptyGroupList(i, j, false);
                    }
                    else {
                        this.goAbend("setupEmptyGroups", "already exist");
                    }
                }
            /*
            else if ((this.boardObject().boardArray_1(i, j) & GO.MARK_DEAD_STONE_DIFF) != 0) {
                if (!this.emptyGroupList_().stoneExistInGroupList(i, j)) {
                    this.emptyGroupList_().insertStoneToEmptyGroupList(i, j, true);
                }
            }
            */
            }
        }
    };

    this.scoreEmptyGroups = function () {
        var group;
        var color;
        var i;
        i = 0;
        while (i < this.emptyGroupList().groupCount()) {
            group = this.emptyGroupList().listArray(i);
            color = group.scoreOneEmptyGroup();
            if (color === this.GO().BLACK_STONE()) {
                this.goLog("scoreEmptyGroups", "black");
                this.emptyGroupList().removeGroupFromGroupList(group);
                this.blackEmptyGroupList().insertGroupToGroupList(group);

            } else if (color === this.GO().WHITE_STONE()) {
                this.goLog("scoreEmptyGroups", "white");
                this.emptyGroupList().removeGroupFromGroupList(group);
                this.whiteEmptyGroupList().insertGroupToGroupList(group);
            } else {
                i += 1;
            }
        }
    };

    this.printScore = function () {
        var score1;

        this.goLog("printScore", this.blackScoreString());
        this.goLog("printScore", this.whiteScoreString());
    /*
    if (this.black_score - this.white_score >= this.configObject().komiPoint_() + 1) {
      score1 = this.black_score - this.white_score - theGame_().komi_() - 1;
    }
    else {
      score1 = this.white_score - this.black_score + this.configObject()_.komiPoint_();
    }
    */
    //theBoard_().print_it();
    };

    this.abendEngine = function () {
        var stones_count = 0;
        var i = 0;
        while (i < 7) {
            //this.groupListArray(i).abendGroupList();
            stones_count += this.groupListArray(i).totalStoneCount();
            i += 1;
        }

        //this.goLog("abendEngine", this.gameObject().gameIsOver());
        if (this.gameObject().gameIsOver()) {
            if (this.boardSize() * this.boardSize() !== stones_count) {
                this.goAbend("abendEngine", "stones_count=" + stones_count);
            }
        }
        /*
        this.blackGroupList().abendGroupList();
        this.whiteGroupList().abendGroupList();
        this.blackDeadGroupList().abendGroupList();
        this.whiteDeadGroupList().abendGroupList();
        this.blackEmptyGroupList().abendGroupList();
        this.whiteEmptyGroupList().abendGroupList();
        this.emptyGroupList().abendGroupList();
        */
    };

    this.goAbend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.goLog = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.resetEngineObjectData = function () {
        this.theGroupListArray = [7];
        this.theGroupListArray[1] = this.groupListModule().malloc(this, 1, this.GO().BLACK_STONE(), false, null, null);
        this.theGroupListArray[2] = this.groupListModule().malloc(this, 2, this.GO().WHITE_STONE(), false, null, null);
        this.resetMarkedGroupLists();
        this.resetEmptyGroupLists();

       this.theCaptureCount = null;
       this.theLastDeadStone = null;

        this.theBlackCaptureStones = 0;
        this.theWhiteCaptureStones = 0;
    };

    this.theObjectName = "GoEngineObject";
    this.theContainerObject = container_object_val;
    this.resetEngineObjectData();
}
1