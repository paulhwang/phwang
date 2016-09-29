/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_ui.js
 */

function GoUiObject(container_val) {
    "use strict";
    this.theContainerObject = container_val;

    this.objectName = function () {
        return "GoUiObject";
    };

    this.canvasId = function () {
        return "goCanvas";
    };

    this.containerObject = function () {
        return this.theContainerObject;
    };

    this.gameObject = function () {
        return this.containerObject().gameObject();
    };

    this.boardObject = function () {
        return this.containerObject().boardObject();
    };

    this.configObject = function () {
        return this.containerObject().configObject();
    };

    this.boardSize = function () {
        return this.configObject().boardSize();
    };

    this.canvasElement = function () {
        return this.theCanvasElement;
    };

    this.blackScoreElement = function () {
        return this.theBlackScoreElement;
    };

    this.whiteScoreElement = function () {
        return this.theWhiteScoreElement;
    };

    this.finalScoreElement = function () {
        return this.theFinalScoreElement;
    };

    this.canvasContext = function () {
        return this.theCanvasContext;
    };

    this.lastMouseX = function () {
        return this.theLastMouseX;
    };

    this.setLastMouseX = function (val) {
        this.theLastMouseX = val;
    };

    this.lastMouseY = function () {
        return this.theLastMouseY;
    };

    this.setLastMouseY = function (val) {
        this.theLastMouseY = val;
    };

    this.encodedMoveList = function () {
        return this.theEncodedMoveList;
    };

    this.setEncodedMoveList = function (val) {
        this.theEncodedMoveList = val;
    };

    this.getGridLength = function () {
        return this.canvasElement().width / (this.configObject().boardSize() + 1);
    };

    this.getArrowUnitLength = function () {
        return this.canvasElement().width / 20;
    };

    this.uiClickApi = function (event_x, event_y) {
        this.uiClick(event_x, event_y);
        this.drawBoard();
    };

    this.uiClick = function (event_x, event_y) {
        var arrow_len = this.getArrowUnitLength();
        var grid_len = this.getGridLength();
        //var canvas_extra = go.canvas.height - go.canvas.width;

        //GO.goLog("GoUiObject.uiInput(Both boards)", " event_x=" + event_x + " event_y=" + event_y);
        //goDebug("goInput", go.canvas_id + " left=" + go.canvas.getBoundingClientRect().left + " top=" + go.canvas.getBoundingClientRect().top);
        if (event_x < this.canvasElement().getBoundingClientRect().left) {
            return;
        }
        if (event_y < this.canvasElement().getBoundingClientRect().top) {
            return;
        }
        if (event_x > this.canvasElement().getBoundingClientRect().left + this.canvasElement().getBoundingClientRect().width) {
            return;
        }
        if (event_y > this.canvasElement().getBoundingClientRect().top + this.canvasElement().getBoundingClientRect().height) {
            return;
        }

        //GO.goLog("GoUiObject.uiInput", " event_x=" + event_x + " event_y=" + event_y);

        if (event_y > this.canvasElement().getBoundingClientRect().top + this.canvasElement().getBoundingClientRect().width) {
            if (event_y < this.canvasElement().getBoundingClientRect().top + this.canvasElement().getBoundingClientRect().width + arrow_len) {
                return;
            }
            if (event_y > this.canvasElement().getBoundingClientRect().top + this.canvasElement().getBoundingClientRect().width + arrow_len * 2) {
                return;
            }

            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 2.5) {
                this.gameObject().processDoubleBackwardMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 4.5) {
                this.gameObject().processBackwardMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 6.5) {
                this.gameObject().processForwardMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 8.5) {
                this.gameObject().processDoubleForwardMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 10.5) {
                if (this.gameObject().isMyTurn()) {
                    this.gameObject().processPassMoveFromUi();
                    this.drawBoard();
                }
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 12.5) {
                this.gameObject().processConfirmMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 14.5) {
                this.gameObject().processResignMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 16.5) {
                this.gameObject().processPlayAnotherGameMoveFromUi();
                this.drawBoard();
                return;
            }
            if ((event_x - this.canvasElement().getBoundingClientRect().left) < arrow_len * 18.5) {
                this.gameObject().processBackToPlayMoveFromUi();
                this.drawBoard();
                return;
            }
            return;
        }

        var x = Math.round((event_x - this.canvasElement().getBoundingClientRect().left) / grid_len) - 1;
        var y = Math.round((event_y - this.canvasElement().getBoundingClientRect().top) / grid_len) - 1;
        if ((x < 0) || (y < 0) || (x >= this.configObject().boardSize()) || (y >= this.configObject().boardSize())) {
            return;
        }

        this.logit("uiClick", this.canvasId() + "(" + x + "," + y + ")");
        if (!this.gameObject().isMyTurn()) {
            this.logit("uiClick", "not my turn");
            return;
        }

        this.gameObject().enterGameFromUi(x, y);
    };

    this.uiMouseMove = function (event_x, event_y) {
        if (!this.gameObject().isMyTurn()) {
            return;
        }
        //GO.goLog("GoUiObject.uiMouseMove", this.canvasId_() + "(" + event_x + "," + event_y + ")");

        var grid_len = this.getGridLength();
        var x = Math.round((event_x - this.canvasElement().getBoundingClientRect().left) / grid_len) - 1;
        var y = Math.round((event_y - this.canvasElement().getBoundingClientRect().top) / grid_len) - 1;
        if ((x < 0) || (y < 0) || (x >= this.configObject().boardSize()) || (y >= this.configObject().boardSize())) {
            return;
        }

        if ((this.lastMouseX() !== x) || (this.lastMouseY() !== y)) {
            //GO.goLog("GoUiObject.uiMouseMove--", this.canvasId_() + "(" + x + "," + y + ")");
            this.setLastMouseX(x);
            this.setLastMouseY(y);
            this.drawBoard();
        }
    };

    this.drawBoard = function () {
        var arrow_color = "black";
        var grid_len = this.getGridLength();
        //var half_grid_len = grid_len / 2;
        var micro_grid_len = grid_len / 8;
        //var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();
        //var canvas_extra = this.canvasElement_().height - this.canvasElement_().width;

        context.fillStyle = arrow_color;
        context.lineWidth = 1;
        context.strokeStyle = '#003300';

        this.drawArrows();

        context.fillStyle = "#FF8000";
        context.fillRect(0, 0, this.canvasElement().width, this.canvasElement().width);

        this.drawEmptyBoard();
        this.drawStones();
        if (this.gameObject().gameIsOver()) {
            this.drawMarkedStones();
            //////////////////this.drawLandMarks();
        }
        this.drawCandidateStone();
        this.drawScore();
    };

    this.drawStones = function () {
        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();
        var paint;
        var i, j;

        i = 0;
        while (i < this.boardSize()) {
            j = 0;
            while (j < this.boardSize()) {
                if (this.boardObject().boardArray(i, j) === GO.BLACK_STONE()) {
                    paint = "black";
                } else if (this.boardObject().boardArray(i, j) === GO.WHITE_STONE()) {
                    paint = "white";
                }

                if (paint) {
                    this.drawOneStone(i, j, paint);
                    /*
                    context.beginPath();
                    context.arc((i + 1) * grid_len, (j + 1) * grid_len, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = paint;
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#003300';
                    context.stroke();
                    */

                    if (!this.gameObject().gameIsOver() && this.gameObject().isLastMove(i, j)) {
                        this.drawCandidateStone(i, j);
                        /*
                        context.beginPath();
                        context.arc((i + 1) * grid_len, (j + 1) * grid_len, radius / 2, 0, 2 * Math.PI, false);
                        context.fillStyle = "red";
                        context.fill();
                        context.lineWidth = 1;
                        context.strokeStyle = '#003300';
                        context.stroke();
                        */
                    }
                    paint = null;
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.drawOneStone = function (x_val, y_val, paint_val) {
        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();

        context.beginPath();
        context.arc((x_val + 1) * grid_len, (y_val + 1) * grid_len, radius, 0, 2 * Math.PI, false);
        context.fillStyle = paint_val;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
     }

    this.drawLandMarks = function () {
        var group_list;
        var i = 5;
        while (i < 7) {
            group_list = this.engineObject().groupListArray(i);
            if (group_list) {
                //this.goLog("drawLandMarks", group_list.objectName() + group_list.indexNumber());
                group_list.drawOneEmptyGroupList();
            }
            i += 1;
        }
    }

    this.drawOneStoneMark = function (x_val, y_val, paint_val) {
        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();
        
        context.beginPath();
        context.arc((x_val + 1) * grid_len, (y_val + 1) * grid_len, radius / 2, 0, 2 * Math.PI, false);
        context.fillStyle = paint_val;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    this.drawCandidateStone = function (x_val, y_val) {
        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();
        
        context.beginPath();
        context.arc((x_val + 1) * grid_len, (y_val + 1) * grid_len, radius / 2, 0, 2 * Math.PI, false);
        context.fillStyle = "red";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    this.drawMarkedStones = function () {
        var i, j;

        //GO.goLog("GoUiObject.drawMarkedStones", "");
        i = 0;
        while (i < this.boardSize()) {
            j = 0;
            while (j < this.boardSize()) {
                if (this.boardObject().boardArray(i, j)) {
                    //GO.goLog("GoUiObject.drawMarkedStones", "(" + i + "," + j + ") " + this.boardObject().boardArray(i, j));
                }
                if (this.boardObject().boardArray(i, j) === GO.MARKED_DEAD_BLACK_STONE()) {
                    //GO.goLog("GoUiObject.drawMarkedStones", "black" + i + j);
                    this.drawOneMarkedStone(i, j, "black");
                } else if (this.boardObject().boardArray(i, j) === GO.MARKED_DEAD_WHITE_STONE()) {
                    //GO.goLog("GoUiObject.drawMarkedStones", "white");
                    this.drawOneMarkedStone(i, j, "white");
                }
                j += 1;
            }
            i += 1;
        }
    };

    this.drawOneMarkedStone = function (x_val, y_val, paint_val) {
        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 3.2 * micro_grid_len;
        var context = this.canvasContext();

        //GO.goLog("drawOneMarkedStone", "white");
        context.beginPath();
        context.arc((x_val + 1) * grid_len, (y_val + 1) * grid_len, radius, 0, 2 * Math.PI, false);
        context.fillStyle = paint_val;
        context.fill();
                    //context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();

        context.beginPath();
        context.arc((x_val + 1) * grid_len, (y_val + 1) * grid_len, radius / 2, 0, 2 * Math.PI, false);
        context.fillStyle = "gray";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    this.drawCandidateStone = function () {
        if (!this.gameObject().isMyTurn() && !this.gameObject().gameIsOver()) {
            return;
        }

        var grid_len = this.getGridLength();
        var micro_grid_len = grid_len / 8;
        var radius = 2 * micro_grid_len;
        var context = this.canvasContext();
        var paint;

        //GO.goLog("GoUiObject.drawCandidateStone", "");

        if (this.gameObject().nextColor() === GO.BLACK_STONE()) {
            //GO.goLog("GoUiObject.drawMarkedStones", "black" + i + j);
            paint = "black";
            if (this.gameObject().gameIsOver()) {
                paint = "gray";
            }
            context.beginPath();
            context.arc((this.lastMouseX() + 1) * grid_len, (this.lastMouseY() + 1) * grid_len, radius, 0, 2 * Math.PI, false);
            context.fillStyle = paint;
            context.fill();
            //context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        } else {
            //GO.goLog("GoUiObject.drawMarkedStones", "white");
            paint = "white";
            if (this.gameObject().gameIsOver()) {
                paint = "gray";
            }
            context.beginPath();
            context.arc((this.lastMouseX() + 1) * grid_len, (this.lastMouseY() + 1) * grid_len, radius, 0, 2 * Math.PI, false);
            context.fillStyle = paint;
            context.fill();
            //context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }
    };

    this.drawEmptyBoard = function () {
        var grid_len = this.getGridLength();
        var context = this.canvasContext();

        context.lineWidth = 1;
        var i = 1;
        while (i <= this.boardSize()) {
            context.moveTo(grid_len, grid_len * i);
            context.lineTo(grid_len * this.configObject().boardSize(), grid_len * i);
            context.stroke();
            context.moveTo(grid_len * i, grid_len);
            context.lineTo(grid_len * i, grid_len * this.configObject().boardSize());
            context.stroke();
            i += 1;
        }

        if (this.boardSize() === 9) {
            drawBoardDot(5, 5);
        } else if (this.boardSize() === 13) {
            drawBoardDot(4, 4);
            drawBoardDot(4, 10);
            drawBoardDot(10, 4);
            drawBoardDot(10, 10);
            drawBoardDot(7, 7);
        } else if (this.boardSize() === 19) {
            drawBoardDot(4, 4);
            drawBoardDot(4, 10);
            drawBoardDot(4, 16);
            drawBoardDot(10, 4);
            drawBoardDot(10, 10);
            drawBoardDot(10, 16);
            drawBoardDot(16, 4);
            drawBoardDot(16, 10);
            drawBoardDot(16, 16);
        }

        function drawBoardDot(x_val, y_val) {
            context.beginPath();
            context.arc(x_val * grid_len, y_val * grid_len, 3, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }
    };

    this.drawArrows = function () {
        var arrow_len = this.getArrowUnitLength();
        var context = this.canvasContext();

        context.beginPath();
        context.moveTo(arrow_len * 0.5,  arrow_len * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 1.25, arrow_len       + this.canvasElement().width);
        context.lineTo(arrow_len * 1.25, arrow_len * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 0.5,  arrow_len * 1.5 + this.canvasElement().width);
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(arrow_len * 1.25, arrow_len * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 2,    arrow_len       + this.canvasElement().width);
        context.lineTo(arrow_len * 2,    arrow_len * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 1.25, arrow_len * 1.5 + this.canvasElement().width);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(arrow_len * 3, arrow_len  * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 4, arrow_len        + this.canvasElement().width);
        context.lineTo(arrow_len * 4, arrow_len  * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 3, arrow_len  * 1.5 + this.canvasElement().width);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(arrow_len * 5, arrow_len       + this.canvasElement().width);
        context.lineTo(arrow_len * 6, arrow_len * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 5, arrow_len * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 5, arrow_len       + this.canvasElement().width);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(arrow_len * 7,    arrow_len       + this.canvasElement().width);
        context.lineTo(arrow_len * 7.75, arrow_len * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 7,    arrow_len * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 7,    arrow_len       + this.canvasElement().width);
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(arrow_len * 7.75, arrow_len       + this.canvasElement().width);
        context.lineTo(arrow_len * 8.5,  arrow_len * 1.5 + this.canvasElement().width);
        context.lineTo(arrow_len * 7.75, arrow_len * 2   + this.canvasElement().width);
        context.lineTo(arrow_len * 7.75, arrow_len       + this.canvasElement().width);
        context.fill();
        context.stroke();
        context.moveTo(arrow_len * 8.5, arrow_len     + this.canvasElement().width);
        context.lineTo(arrow_len * 8.5, arrow_len * 2 + this.canvasElement().width);
        context.stroke();

        context.moveTo(arrow_len * 0.5, arrow_len     + this.canvasElement().width);
        context.lineTo(arrow_len * 0.5, arrow_len * 2 + this.canvasElement().width);
        context.stroke();

        context.fillStyle = "pink";
        context.fillRect(arrow_len * 8.5, arrow_len + this.canvasElement().width, arrow_len * 2, arrow_len);
        context.fillStyle = "yellow";
        context.fillRect(arrow_len * 10.5, arrow_len + this.canvasElement().width, arrow_len * 2, arrow_len);
        context.fillStyle = "pink";
        context.fillRect(arrow_len * 12.5, arrow_len + this.canvasElement().width, arrow_len * 2, arrow_len);
        context.fillStyle = "yellow";
        context.fillRect(arrow_len * 14.5, arrow_len + this.canvasElement().width, arrow_len * 2, arrow_len);
        context.fillStyle = "pink";
        context.fillRect(arrow_len * 16.5, arrow_len + this.canvasElement().width, arrow_len * 2, arrow_len);
    };

    this.drawScore = function () {
        this.blackScoreElement().textContent = this.gameObject().blackScoreString();
        this.whiteScoreElement().textContent = this.gameObject().whiteScoreString();
        //this.finalScoreElement().textContent = this.gameObject().finalScoreString();
    };

    this.abend = function (str1_val, str2_val) {
        return this.containerObject().goAbend(this.objectName() + "." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.containerObject().goLog(this.objectName() + "." + str1_val, str2_val);
    };

    this.theLastMouseX = 9;
    this.theLastMouseY = 9;
    this.theEncodedMoveList = null;

    this.initElements = function () {
        this.theCanvasElement = window.document.getElementById(this.canvasId());
        if (this.canvasElement() === null) {
            this.goAbend("GoUiObject", "null canvasElement");
            return;
        }

        this.theCanvasContext = this.theCanvasElement.getContext("2d");
        if (this.canvasContext() === null) {
            this.goAbend("GoUiObject", "null canvasContext");
            return;
        }

        this.theBlackScoreElement = window.document.getElementById("black_score");
        if (this.blackScoreElement() === null) {
            this.goAbend("GoUiObject", "null theBlackScoreElement");
            return;
        }

        this.theWhiteScoreElement = window.document.getElementById("white_score");
        if (this.whiteScoreElement() === null) {
            this.goAbend("GoUiObject", "null theWhiteScoreElement");
            return;
        }
    };
}
