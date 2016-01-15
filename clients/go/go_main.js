var main = function () {
    "use strict";

    document.cookie = "paul's cookie is here";
    var root = new RootObject();
    //root.runPrelude();
/*
    function updateTimer () {
        console.log("updateTimer() ", root.sessionMgrObject().queueSize());
        if (root.sessionMgrObject().queueSize() === 0) {
            //root.ajaxObject().getNameList(getNameListCallback, session_val);

        } else {
            root.ajaxObject().getPendingData(getPendingDataCallback, root);
        }
    }

    function getPendingDataCallback (root_val) {
        //console.log("getPendingDataCallback " + root_val.objectName());
    }
    */
/*
    function runPrelude () {
        root.htmlObject().createPreludeHolder();
        $(".prelude_holder button").on("click", function() {
            root.setMyName($(".prelude_holder input").val());
            root.setLanguageUsed($(".prelude_holder select").val());
            console.log("runPrelude() ", "name=" + root.myName() + " language=" + root.languageUsed());
            if (root.myName()) {
                root.ajaxObject().setupLink(setupLinkCallback, root);
            }
        });
    }

    function setupLinkCallback (root_val) {
        window.setInterval(updateTimer, 1000);
        var session = new SessionObject(root_val);
        var container = new GoContainerObject(session);
        root_val.ajaxObject().getNameList(getNameListCallback, container);
    }

    function getNameListCallback (container_val) {
        console.log("getNameListCallback() " + container_val.objectName());
        container_val.sessionObject().runCreateSession(container_val);

        //runCreateSession(container_val);
    }
    */
/*
    function runCreateSession (container_val) {
        //console.log("runCreateSession() " + container_val.objectName());
        var session = container_val.sessionObject();
        session.rootObject().htmlObject().createSessionHolders(session);
        $(".peer_name_paragraph button").on("click", function() {
            //session.setHisName($(".peer_main_section select").val());
            //console.log("runCreateSession() ", "peer_name=" + session.hisName());
            session.ajaxObject().getNameList(getNameListCallback, container_val);
        });

        $(".peer_game_paragraph button").on("click", function() {
            session.setGameName($(".peer_game_paragraph select").val());
            runCreateSession(container_val);
        });

        $(".peer_connect_section button").on("click", function() {
            session.setHisName($(".peer_name_paragraph select").val());
            container_val.sessionObject().setHisName($(".peer_name_paragraph select").val());
            var config = container_val.configObject();
            config.setBoardSize($(".board_size_section select").val());
            config.setMyColor($(".play_color_section select").val());
            config.setKomiPoint($(".komi_section select").val());
            config.setHandicapPoint($(".handicap_section select").val());
            console.log("runConfig() ", " my_name=" + container_val.rootObject().myName() +
                                        " his_name=" + container_val.sessionObject().hisName() +
                                        " board_size=" + config.boardSize() +
                                        " color=" + config.myColor() +
                                        " komi=" + config.komiPoint() +
                                        " handicap=" + config.handicapPoint());
            session.ajaxObject().initiateSessionConnection(setupSessionCallback, container_val);
        });
    }


    function setupSessionCallback (container_val) {
        container_val.sessionObject().stopUpdateNameListTimer();
        container_val.runGoGame();
        //runGoGame(container_val);
    }
    */
/*
    function runGoGame (container_val) {
        container_val.startGoGame();
        container_val.rootObject().htmlObject().createPlayHolders();
        container_val.uiObject().initElements();
        container_val.uiObject().drawBoard(container_val.engineObject());

        $("canvas").on("click", function(event) {
            container_val.uiObject().uiClickApi(event.clientX, event.clientY);
        });

        $("canvas").on("mousemove", function(event) {
            container_val.uiObject().uiMouseMove(event.clientX, event.clientY);
        });

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
    }
    */
};

$(document).ready(main);







