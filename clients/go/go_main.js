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
        session.rootObject().htmlObject().createSessionHolders();
        $(".session_holder button").on("click", function() {
            session.setHisName($(".opponent_section select").val());
            if (session.hisName() === "Myself") {
                session.setHisName(session.rootObject().myName());
            }
            console.log("runConfig() ", "peer_name=" + session.hisName());
            if (session.hisName()) {
                session.setHisName(session.hisName());
                runGoConfig(session);
            }
        });
    }

    function runGoConfig (session_val) {
        var config = new GoConfigObject(session_val);
        session_val.rootObject().htmlObject().createConfigHolders();
        $(".config_holder button").on("click", function() {
            config.setBoardSize($(".board_size_section select").val());
            config.setMyColor($(".play_color_section select").val());
            config.setKomiPoint($(".komi_section select").val());
            config.setHandicapPoint($(".handicap_section select").val());
            console.log("runConfig() ", " board_size=" + config.boardSize() +
                            " color=" + config.myColor() +
                            " komi=" + config.komiPoint() +
                            " handicap=" + config.handicapPoint());
            runGoGame(session_val, config);
        });
    }

    function runGoGame (session_val, config_val) {
        var container = new GoContainerObject(session_val, config_val);
        session_val.setContainerObject(container);
        
        container.sessionObject().rootObject().htmlObject().createPlayHolders();
        container.uiObject().initElements();
        container.uiObject().drawBoard(container.engineObject());

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
            container.uiObject().uiClickApi(event.clientX, event.clientY);
        });

        $("canvas").on("mousemove", function(event) {
            container.uiObject().uiMouseMove(event.clientX, event.clientY);
        });
    }
};

$(document).ready(main);







