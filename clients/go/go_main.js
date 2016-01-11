var main = function () {
    "use strict";

    document.cookie="paul's cookie is here";

    var goTwoBoard = false;
    var theMainGoConfigObject;

    runPrelude();

    function runPrelude () {
        var root = new RootObject();
        var html = new GoHtmlObject(root, goTwoBoard);
        root.setHtmlObject(html);
        html.createPreludeHolder();
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
        theMainGoConfigObject = new GoConfigObject(session_val.rootObject().myName());
        var config = theMainGoConfigObject;
        session_val.rootObject().htmlObject().createConfigHolders();
        $(".config_holder button").on("click", function() {
            config.setBoardSize($(".board_size_section select").val());
            config.setMyColor($(".play_color_section select").val());
            config.setKomiPoint($(".komi_section select").val());
            config.setHandicapPoint($(".handicap_section select").val());
            config.setOpponentName($(".opponent_section select").val());
            if (config.opponentName() === "Myself") {
                config.setOpponentName(session_val.rootObject().myName());
            }
            console.log("runConfig() ", "opponent=" + config.opponentName() + " board_size=" + theMainGoConfigObject.boardSize() +
                            " color=" + config.myColor() +
                            " komi=" + config.komiPoint() +
                            " handicap=" + config.handicapPoint());
            if (config.opponentName()) {
                session_val.setHisName(config.opponentName());
                runGoGame(session_val);
            }
        });
    }

    function runGoGame (session_val) {
        session_val.rootObject().htmlObject().createPlayHolders();

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
            var goContainer2 = new GoContainerObject(session_val.rootObject(), goConfig2, goUi2, "2");
            goUi2.initElements();
            goUi2.drawBoard(goContainer2.engineObject());

            goContainer2.setHisContainerObject(goContainer);
            goContainer.setHisContainerObject(goContainer2);
        }
    }
};

$(document).ready(main);







