/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_engine.js
 */

function GoEngineObject(container_object_val) {
    "use strict";

    this.objectName = function () {
        return this.theObjectName;
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

    this.boardArray = function () {
        return this.boardObject().boardArray();
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
    };

    this.addWhiteCaptureStones = function (count_val) {
        this.theWhiteCaptureStones += count_val;
    };

    this.blackScore = function () {
        return this.blackLandScore() + this.blackCaptureStones()
                + this.whiteDeadGroupList().totalStoneCount() * 2 + this.configObject().realKomiPoint();
    };

    this.whiteScore = function () {
        return this.whiteLandScore() + this.whiteCaptureStones()
                + this.blackDeadGroupList().totalStoneCount() * 2;
    };

    this.blackScoreString = function () {
        if (!this.gameObject().gameIsOver()) {
            return "Black: " + this.blackCaptureStones();
        }
        else {
            return "Black: " + this.blackScore() + " ("
                    + this.blackCaptureStones() + " + "
                    + this.blackLandScore() + " + "
                    + this.whiteDeadGroupList().totalStoneCount() + " x 2 + "
                    + this.configObject().realKomiPoint() + ")";
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
                    + this.blackDeadGroupList().totalStoneCount() + " x 2)";
        }
    };

    this.enterWar = function (move_val) {
        this.goLog("goEnterWar", "(" + move_val.xX() + "," + move_val.yY() + ") color=" + move_val.myColor() + " turn=" + move_val.turnIndex());

        var group = this.insertStoneToGroupList(move_val);
        this.boardObject().addStoneToBoard(move_val.xX(), move_val.yY(), move_val.myColor());
        var dead_count = this.killOtherColorGroups(move_val, group);

        if (!group.groupHasAir()) {
            this.removeDeadGroup(group);
        }

        if (dead_count !== 0) {
            if (move_val.myColor() === GO.BLACK_STONE()) {
                this.addBlackCaptureStones(dead_count);
            } else if (move_val.myColor() === GO.WHITE_STONE()) {
               this.addWhiteCaptureStones(dead_count);
            } else {
                this.goAbend("enterWar", "color=" + move_val.myColor());
            }
        }
        this.abendEngine();
    };

    this.insertStoneToGroupList = function (move_val) {
        var g_list;

        if (move_val.myColor() === GO.BLACK_STONE()) {
            g_list = this.blackGroupList();
        } else if (move_val.myColor() === GO.WHITE_STONE()) {
            g_list = this.whiteGroupList();
        } else {
            this.goAbend("insertStoneToGroupList", "color=" + move_val.myColor());
        }

        var group = g_list.findCandidateGroup(move_val.xX(), move_val.yY());
        if (!group) {
            group = new GoGroupObject(g_list);
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
        this.setValidLastDeadInfo(false);
        count = this.killOtherColorGroup(group_val, move_val.xX() - 1, move_val.yY());
        count += this.killOtherColorGroup(group_val, move_val.xX() + 1, move_val.yY());
        count += this.killOtherColorGroup(group_val, move_val.xX(), move_val.yY() - 1);
        count += this.killOtherColorGroup(group_val, move_val.xX(), move_val.yY() + 1);
        return count;
    };

    this.killOtherColorGroup = function (group, x, y) {
        var his_group;

        if (!GO.isValidCoordinates(x, y, this.configObject().boardSize())) {
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
        if (group.myColor() === GO.BLACK_STONE()) {
            this.blackGroupList().removeOneDeadGroup(group);
        } else {
            this.whiteGroupList().removeOneDeadGroup(group);
        }
    };

    this.markLastDeadInfo = function (group_val) {
        this.setValidLastDeadInfo(true);
        this.setLastDeadX(group_val.maxX());
        this.setLastDeadY(group_val.maxY());

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

    this.getGroupByCoordinate = function (x_val, y_val, color_val) {
        //goDebug("GoEngineObject.getGroupByCoordinate", color_val);
        var g_list;
        if ((color_val === GO.BLACK_STONE()) || (color_val === GO.MARKED_DEAD_BLACK_STONE())) {
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
        if (this.boardObject().boardArray(x_val, y_val) === GO.EMPTY_STONE()) {
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
                if (this.boardObject().boardArray(i, j) === GO.EMPTY_STONE()) {
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
            if (color === GO.BLACK_STONE()) {
                this.goLog("scoreEmptyGroups", "black");
                this.emptyGroupList().removeGroupFromGroupList(group);
                this.blackEmptyGroupList().insertGroupToGroupList(group);

            } else if (color === GO.WHITE_STONE()) {
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

        this.goLog("printScore", "Black: " + this.blackScore() + " (" + this.blackCaptureStones() + " + " + this.blackLandScore() + " + " + this.whiteDeadGroupList().totalStoneCount() + "*2)");
        this.goLog("printScore", "White: " + this.whiteScore() + " (" + this.whiteCaptureStones() + " + " + this.whiteLandScore() + " + " + this.blackDeadGroupList().totalStoneCount() + "*2)");
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
    this.theObjectName = "GoEngineObject";
    this.theContainerObject = container_object_val;
}
1