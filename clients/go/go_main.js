var main = function () {
    "use strict";

    document.cookie="paul's cookie is here";

    var goTwoBoard = true;
    var theMainRootObject = new RootObject();
    var theMainPreludeObject = new PreludeObject(theMainRootObject.utilObject());
    var theMainHtmlObject = new GoHtmlObject(theMainPreludeObject, goTwoBoard);
    var theMainGoConfigObject;

    runPrelude();

    function runPrelude () {
        theMainHtmlObject.createPreludeHolder();
        $(".prelude_holder button").on("click", function() {
            theMainPreludeObject.setMyName($(".prelude_holder input").val());
            theMainPreludeObject.setLanguageUsed($(".prelude_holder select").val());
            console.log("runPrelude() ", "name=" + theMainPreludeObject.myName() + " language=" + theMainPreludeObject.languageUsed());
            if (theMainPreludeObject.myName()) {
               runGoConfig();
            }
        });
    }

    function runGoConfig () {
        theMainGoConfigObject = new GoConfigObject(theMainPreludeObject.myName());
        theMainHtmlObject.createConfigHolders();
        $(".config_holder button").on("click", function() {
            theMainGoConfigObject.setBoardSize($(".board_size_section select").val());
            theMainGoConfigObject.setMyColor($(".play_color_section select").val());
            theMainGoConfigObject.setKomiPoint($(".komi_section select").val());
            theMainGoConfigObject.setHandicapPoint($(".handicap_section select").val());
            theMainGoConfigObject.setOpponentName($(".opponent_section select").val());
            console.log("runConfig() ", "opponent=" + theMainGoConfigObject.opponentName() + " board_size=" + theMainGoConfigObject.boardSize() +
                            " color=" + theMainGoConfigObject.myColor() +
                            " komi=" + theMainGoConfigObject.komiPoint() +
                            " handicap=" + theMainGoConfigObject.handicapPoint());
            if (theMainGoConfigObject.opponentName()) {
                runGoGame();
            }
        });
    }

    function runGoGame () {
        theMainHtmlObject.createPlayHolders();

        //console.log ("runGoGame", "opponent=" + theMainGoConfigObject.opponentName());

        var addCommentFromInputBox = function () {
            var $new_comment = $("<p>");
            if ($(".comment-input input").val() !== "") {
                $new_comment.text($(".comment-input input").val());
                $new_comment.hide();
                $(".comments").append($new_comment);
                $new_comment.fadeIn();
                $(".comment-input input").val("");
            }
        };

        $(".comment-input button").on("click", function(event) {
            addCommentFromInputBox();
        });

        $(".comment-input input").on("keypress", function(event) {
            if (event.keyCode == 13) {
                addCommentFromInputBox();
            }
        });

        $("canvas").on("click", function(event) {
            goUi.uiClickApi(event.clientX, event.clientY);
            if (goContainer2) {
                goUi2.uiClickApi(event.clientX, event.clientY);
            }
        });
        $("canvas").on("mousemove", function(event) {
            goUi.uiMouseMove(event.clientX, event.clientY);
            if (goContainer2) {
                goUi2.uiMouseMove(event.clientX, event.clientY);
            }
        });

        var goUi = new GoUiObject("goCanvas");
        var goContainer = new GoContainerObject(theMainGoConfigObject, goUi, "1");
        goUi.initElements();
        goUi.drawBoard(goContainer.engineObject());

        if (theMainGoConfigObject.opponentName() === "Myself") {
            console.log("runGoGame() " + "Myself");
            theMainGoConfigObject.setOpponentName(theMainPreludeObject.myName());
        } if (goTwoBoard) {
            var goUi2 = new GoUiObject("goCanvas2");
            var goConfig2 = theMainGoConfigObject.createTwoBoardOpponentConfig();
            var goContainer2 = new GoContainerObject(goConfig2, goUi2, "2");
            goUi2.initElements();
            goUi2.drawBoard(goContainer2.engineObject());

            goContainer2.setHisContainerObject(goContainer);
            goContainer.setHisContainerObject(goContainer2);
        }
    }
};

$(document).ready(main);







