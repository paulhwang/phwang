var main = function () {
    "use strict";

    document.cookie="paul's cookie is here";
    runPrelude();

    function runPrelude () {
        var root = new RootObject();
        var html = new GoHtmlObject(root);
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
        var config = new GoConfigObject(session_val.rootObject().myName());
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
            console.log("runConfig() ", "opponent=" + config.opponentName() + " board_size=" + config.boardSize() +
                            " color=" + config.myColor() +
                            " komi=" + config.komiPoint() +
                            " handicap=" + config.handicapPoint());
            if (config.opponentName()) {
                session_val.setHisName(config.opponentName());
                var container = new GoContainerObject(session_val, config);
                session_val.setContainerObject(container);
                runGoGame(session_val.containerObject());
            }
        });
    }

    function runGoGame (container_val) {
        container_val.sessionObject().rootObject().htmlObject().createPlayHolders();
        container_val.uiObject().initElements();
        container_val.uiObject().drawBoard(container_val.engineObject());

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
            container_val.uiObject().uiClickApi(event.clientX, event.clientY);
        });

        $("canvas").on("mousemove", function(event) {
            container_val.uiObject().uiMouseMove(event.clientX, event.clientY);
        });
    }
};

$(document).ready(main);







