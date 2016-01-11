var main = function () {
    "use strict";

    document.cookie="paul's cookie is here";

    var goTwoBoard = false;
    var theMainRootObject = new RootObject();
    var theMainHtmlObject = new GoHtmlObject(theMainRootObject, goTwoBoard);
    var theMainSessionObject;
    var theMainGoConfigObject;

    runPrelude();

    function runPrelude () {
        var root = theMainRootObject;
        theMainHtmlObject.createPreludeHolder();
        $(".prelude_holder button").on("click", function() {
            root.setMyName($(".prelude_holder input").val());
            root.setLanguageUsed($(".prelude_holder select").val());
            console.log("runPrelude() ", "name=" + root.myName() + " language=" + root.languageUsed());
            if (root.myName()) {
                root.setupLink();
                runCreateSession(root);
            }
        });
    }

    function runCreateSession (root_val) {
        var session = new SessionObject(root_val);
        runGoConfig(session);
    }

    function runGoConfig (session_val) {
        theMainGoConfigObject = new GoConfigObject(theMainRootObject.myName());
        theMainHtmlObject.createConfigHolders();
        $(".config_holder button").on("click", function() {
            theMainGoConfigObject.setBoardSize($(".board_size_section select").val());
            theMainGoConfigObject.setMyColor($(".play_color_section select").val());
            theMainGoConfigObject.setKomiPoint($(".komi_section select").val());
            theMainGoConfigObject.setHandicapPoint($(".handicap_section select").val());
            theMainGoConfigObject.setOpponentName($(".opponent_section select").val());
            if (theMainGoConfigObject.opponentName() === "Myself") {
                theMainGoConfigObject.setOpponentName(theMainRootObject.myName());
            }
            console.log("runConfig() ", "opponent=" + theMainGoConfigObject.opponentName() + " board_size=" + theMainGoConfigObject.boardSize() +
                            " color=" + theMainGoConfigObject.myColor() +
                            " komi=" + theMainGoConfigObject.komiPoint() +
                            " handicap=" + theMainGoConfigObject.handicapPoint());
            if (theMainGoConfigObject.opponentName()) {
                session_val.setHisName(theMainGoConfigObject.opponentName());
                runGoGame(session_val);
            }
        });
    }

    function runGoGame (session_val) {
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
        var goContainer = new GoContainerObject(session_val, theMainGoConfigObject, goUi, "1");
        goUi.initElements();
        goUi.drawBoard(goContainer.engineObject());

        if (goTwoBoard) {
            var goUi2 = new GoUiObject("goCanvas2");
            var goConfig2 = theMainGoConfigObject.createTwoBoardOpponentConfig();
            var goContainer2 = new GoContainerObject(theMainRootObject, goConfig2, goUi2, "2");
            goUi2.initElements();
            goUi2.drawBoard(goContainer2.engineObject());

            goContainer2.setHisContainerObject(goContainer);
            goContainer.setHisContainerObject(goContainer2);
        }
    }
};

$(document).ready(main);







