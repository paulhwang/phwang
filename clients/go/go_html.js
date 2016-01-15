/*
 * Copyrights phwang
 * Written by Paul Hwang
 * File name: go_html.js
 */

function GoHtmlObject(prelude_val) {
    "use strict";
    this.thePreludeObject = prelude_val;
    this.theCanvasWidth = 432;

    this.thePreludeHolderOn = false;
    this.theTitleHolderOn = false;
    this.theConfigHolderOn = false;
    this.theCanvasHolderOn = false;
    this.theScoreHolderOn = false;

    this.preludeObject = function () {
        return this.thePreludeObject;
    };

    this.canvasWidth = function () {
        return this.theCanvasWidth;
    };

    this.utilObject = function () {
        return this.preludeObject().utilObject();
    };

    this.preludeHolderOn = function () {
        return this.thePreludeHolderOn;
    };

    this.titleHolderOn = function () {
        return this.theTitleHolderOn;
    };

    this.sessionHolderOn = function () {
        return this.theSessionHolderOn;
    };

    this.configHolderOn = function () {
        return this.theConfigHolderOn;
    };

    this.canvasHolderOn = function () {
        return this.theCanvasHolderOn;
    };

    this.scoreHolderOn = function () {
        return this.theScoreHolderOn;
    };

    this.setPreludeHolderOn = function (val) {
        this.thePreludeHolderOn = val;
    };

    this.setTitleHolderOn = function (val) {
        this.theTitleHolderOn = val;
    };

    this.setSessionHolderOn = function (val) {
        this.theSessionHolderOn = val;
    };

    this.setConfigHolderOn = function (val) {
        this.theConfigHolderOn = val;
    };

    this.setCanvasHolderOn = function (val) {
        this.theCanvasHolderOn = val;
    };

    this.setScoreHolderOn = function (val) {
        this.theScoreHolderOn = val;
    };

    this.createPreludeHolder = function () {
        if (this.preludeHolderOn()) {
            return;
        }
        this.setPreludeHolderOn(true);
    };

    this.removePreludeHolder = function () {
        if (!this.preludeHolderOn()) {
            return;
        }
        this.setPreludeHolderOn(false);

        var main_holder = document.getElementById("body");
        var prelude_holder = document.getElementById("prelude_holder");
        main_holder.removeChild(prelude_holder);
    };

    this.createTitleHolder = function () {
        if (this.titleHolderOn()) {
            return;
        }
        this.setTitleHolderOn(true);

        var go_game_paragraph = document.createElement("h1");
        go_game_paragraph.appendChild(document.createTextNode("GO Game"));
        var go_game_section = document.createElement("section");
        go_game_section.setAttribute("id", "go_game");
        go_game_section.appendChild(go_game_paragraph);

        var go_author_paragraph = document.createElement("p");
        go_author_paragraph.appendChild(document.createTextNode("by Paul Hwang"));
        var go_author_section = document.createElement("section");
        go_author_section.setAttribute("id", "go_author");
        go_author_section.appendChild(go_author_paragraph);

        var title_holder = document.createElement("title_holder");
        title_holder.setAttribute("id", "title_holder");
        title_holder.appendChild(go_game_section);
        title_holder.appendChild(go_author_section);

        var main_holder = document.getElementById("body");
        main_holder.appendChild(title_holder);

        this.setHolderStyle(title_holder);
        //this.setH1Style(go_game_section);
        this.setSectionStyleRight(go_author_section);
    };

    this.removeTitleHolder = function () {
        if (!this.titleHolderOn()) {
            return;
        }
        this.setTitleHolderOn(false);

        var main_holder = document.getElementById("body");
        var title_holder = document.getElementById("title_holder");
        main_holder.removeChild(title_holder);
    };

    this.createSessionPeerSection = function (session_val) {
        var root = session_val.rootObject();
        var i;
        var done = false;

        /* name list *************************************************************/
        var peer_name_select = document.createElement("select");
        //peer_name_select.setAttribute("name", "opponent");
        //this.logit("createSessionPeerSection", "his_name=" + session_val.hisName());

        i = 0;
        while (i < root.nameListLength()) {
            var peer_name_option = document.createElement("option");
            peer_name_option.setAttribute("value", root.nameListElement(i));
            peer_name_option.appendChild(document.createTextNode(root.nameListElement(i)));
            peer_name_select.appendChild(peer_name_option);
            if (!done && (root.nameListElement(i) === session_val.hisName())) {
                //this.logit("createSessionPeerSection", "his_name=" + session_val.hisName());
                peer_name_option.setAttribute("selected", null);
                done = true;
            }
            i += 1;
        }

        //var peer_update_button = document.createElement("button");
        //peer_update_button.appendChild(document.createTextNode("Update"));

        var peer_name_paragraph = document.createElement("p");
        peer_name_paragraph.setAttribute("class", "peer_name_paragraph");
        peer_name_paragraph.appendChild(document.createTextNode("Peer Name: "));
        peer_name_paragraph.appendChild(peer_name_select);
        //peer_name_paragraph.appendChild(peer_update_button);

        /* game list *************************************************************/
        var peer_game_select = document.createElement("select");
        var peer_name_select_array = ["Go", "Game1", "Game2"];
        i = 0;
        while (i < peer_name_select_array.length) {
            var peer_game_option = document.createElement("option");
            peer_game_option.setAttribute("value", peer_name_select_array[i]);
            peer_game_option.appendChild(document.createTextNode(peer_name_select_array[i]));
            peer_game_select.appendChild(peer_game_option);
            i += 1;
        }

        var peer_game_button = document.createElement("button");
        peer_game_button.appendChild(document.createTextNode("Select"));

        var peer_game_paragraph = document.createElement("p");
        peer_game_paragraph.setAttribute("class", "peer_game_paragraph");
        peer_game_paragraph.appendChild(document.createTextNode("Game: "));
        peer_game_paragraph.appendChild(peer_game_select);
        peer_game_paragraph.appendChild(peer_game_button);

        /* connect *************************************************************/
        var peer_connect_button = document.createElement("button");
        peer_connect_button.appendChild(document.createTextNode("Connect"));

        var peer_connect_section = document.createElement("section");
        peer_connect_section.setAttribute("class", "peer_connect_section");
        peer_connect_section.appendChild(peer_connect_button);

        /* main *************************************************************/
        var peer_main_section = document.createElement("section");
        //peer_main_section.setAttribute("id", "peer_main_section");
        peer_main_section.setAttribute("class", "peer_main_section");
        peer_main_section.appendChild(peer_name_paragraph);
        peer_main_section.appendChild(peer_game_paragraph);
        if (session_val.gameName() === "Go") {
            peer_main_section.appendChild(this.createGoConfigSection());
        }
        peer_main_section.appendChild(peer_connect_section);

        return peer_main_section;
    };

    this.createGoConfigSection = function () {
        var go_config_section = document.createElement("section");
        go_config_section.setAttribute("id", "go_config_section");
        go_config_section.setAttribute("class", "go_config_section");
        go_config_section.appendChild(this.createConfigBoardSizeSection());
        go_config_section.appendChild(this.createConfigPlayColorSection());
        go_config_section.appendChild(this.createConfigKomiSection());
        go_config_section.appendChild(this.createConfigHandicapSection());

        return go_config_section;
    };

    this.createSessionHolder = function (session_val) {
        if (this.sessionHolderOn()) {
            return;
        }
        this.setSessionHolderOn(true);

        var session_holder = document.createElement("section");
        session_holder.setAttribute("id", "session_holder");
        session_holder.setAttribute("class", "session_holder");
        session_holder.appendChild(this.createSessionPeerSection(session_val));

        var main_holder = document.getElementById("body");
        main_holder.appendChild(session_holder);

        this.setHolderStyle(session_holder);
    };

    this.removeSessionHolder = function (session_val) {
        if (!this.sessionHolderOn()) {
            return;
        }
        this.setSessionHolderOn(false);

        if (session_val) {
            var his_name = $(".peer_name_paragraph select").val();
            if (his_name) {
                session_val.setHisName(his_name);
                //this.logit("removeSessionHolder", "his_name=" + session_val.hisName());
            }
        }

        var main_holder = document.getElementById("body");
        var session_holder = document.getElementById("session_holder");
        main_holder.removeChild(session_holder);

    };

    this.createConfigMyNameSection = function () {
        var my_name_paragraph = document.createElement("p");
        my_name_paragraph.appendChild(document.createTextNode("Name: " + this.preludeObject().myName()));

        var my_name_section = document.createElement("section");
        my_name_section.appendChild(my_name_paragraph);

        return my_name_section;
    };

    this.createConfigBoardSizeSection = function () {
        var board_size_option_19 = document.createElement("option");
        board_size_option_19.setAttribute("value", "19");
        board_size_option_19.appendChild(document.createTextNode("19 x 19"));

        var board_size_option_13 = document.createElement("option");
        board_size_option_13.setAttribute("value", "13");
        board_size_option_13.appendChild(document.createTextNode("13 x 13"));

        var board_size_option_9 = document.createElement("option");
        board_size_option_9.setAttribute("value", "9");
        board_size_option_9.appendChild(document.createTextNode("9 x 9"));

        var board_size_select = document.createElement("select");
        board_size_select.setAttribute("name", "board_size");
        board_size_select.appendChild(board_size_option_19);
        board_size_select.appendChild(board_size_option_13);
        board_size_select.appendChild(board_size_option_9);

        var board_size_paragraph = document.createElement("p");
        board_size_paragraph.appendChild(document.createTextNode("Board Size: "));
        board_size_paragraph.appendChild(board_size_select);

        var board_size_section = document.createElement("section");
        board_size_section.setAttribute("class", "board_size_section");
        board_size_section.appendChild(board_size_paragraph);

        return board_size_section;
    }

    this.createConfigPlayColorSection = function () {
        var play_color_option_black = document.createElement("option");
        play_color_option_black.setAttribute("value", "black");
        play_color_option_black.appendChild(document.createTextNode("Black"));

        var play_color_option_white = document.createElement("option");
        play_color_option_white.setAttribute("value", "white");
        play_color_option_white.appendChild(document.createTextNode("White"));

        var play_color_select = document.createElement("select");
        play_color_select.setAttribute("name", "play_color");
        play_color_select.appendChild(play_color_option_black);
        play_color_select.appendChild(play_color_option_white);

        var play_color_paragraph = document.createElement("p");
        play_color_paragraph.appendChild(document.createTextNode("Stone Color: "));
        play_color_paragraph.appendChild(play_color_select);

        var play_color_section = document.createElement("section");
        play_color_section.setAttribute("class", "play_color_section");
        play_color_section.appendChild(play_color_paragraph);

        return play_color_section;
    }

    this.createConfigKomiSection = function () {
        var komi_option_0 = document.createElement("option");
        komi_option_0.setAttribute("value", "0");
        komi_option_0.appendChild(document.createTextNode("0.5"));

        var komi_option_4 = document.createElement("option");
        komi_option_4.setAttribute("value", "4");
        komi_option_4.appendChild(document.createTextNode("4.5"));

        var komi_option_5 = document.createElement("option");
        komi_option_5.setAttribute("value", "5");
        komi_option_5.setAttribute("selected", null);
        komi_option_5.appendChild(document.createTextNode("5.5"));

        var komi_option_6 = document.createElement("option");
        komi_option_6.setAttribute("value", "6");
        komi_option_6.appendChild(document.createTextNode("6.5"));

        var komi_option_7 = document.createElement("option");
        komi_option_7.setAttribute("value", "7");
        komi_option_7.appendChild(document.createTextNode("7.5"));

        var komi_option_8 = document.createElement("option");
        komi_option_8.setAttribute("value", "8");
        komi_option_8.appendChild(document.createTextNode("8.5"));

        var komi_select = document.createElement("select");
        komi_select.setAttribute("name", "komi");
        komi_select.appendChild(komi_option_0);
        komi_select.appendChild(komi_option_4);
        komi_select.appendChild(komi_option_5);
        komi_select.appendChild(komi_option_6);
        komi_select.appendChild(komi_option_7);
        komi_select.appendChild(komi_option_8);

        var komi_paragraph = document.createElement("p");
        komi_paragraph.appendChild(document.createTextNode("Komi: "));
        komi_paragraph.appendChild(komi_select);

        var komi_section = document.createElement("section");
        komi_section.setAttribute("class", "komi_section");
        komi_section.appendChild(komi_paragraph);

        return komi_section;
    }

    this.createConfigHandicapSection = function () {
        var handicap_option_0 = document.createElement("option");
        handicap_option_0.setAttribute("value", "0");
        handicap_option_0.appendChild(document.createTextNode("0"));

        var handicap_option_2 = document.createElement("option");
        handicap_option_2.setAttribute("value", "2");
        handicap_option_2.appendChild(document.createTextNode("2"));

        var handicap_option_3 = document.createElement("option");
        handicap_option_3.setAttribute("value", "3");
        handicap_option_3.appendChild(document.createTextNode("3"));

        var handicap_option_4 = document.createElement("option");
        handicap_option_4.setAttribute("value", "4");
        handicap_option_4.appendChild(document.createTextNode("4"));

        var handicap_option_5 = document.createElement("option");
        handicap_option_5.setAttribute("value", "5");
        handicap_option_5.appendChild(document.createTextNode("5"));

        var handicap_option_6 = document.createElement("option");
        handicap_option_6.setAttribute("value", "6");
        handicap_option_6.appendChild(document.createTextNode("6"));

        var handicap_option_7 = document.createElement("option");
        handicap_option_7.setAttribute("value", "7");
        handicap_option_7.appendChild(document.createTextNode("7"));

        var handicap_option_8 = document.createElement("option");
        handicap_option_8.setAttribute("value", "8");
        handicap_option_8.appendChild(document.createTextNode("8"));

        var handicap_option_9 = document.createElement("option");
        handicap_option_9.setAttribute("value", "9");
        handicap_option_9.appendChild(document.createTextNode("9"));

        var handicap_option_10 = document.createElement("option");
        handicap_option_10.setAttribute("value", "10");
        handicap_option_10.appendChild(document.createTextNode("10"));

        var handicap_option_11 = document.createElement("option");
        handicap_option_11.setAttribute("value", "11");
        handicap_option_11.appendChild(document.createTextNode("11"));

        var handicap_option_12 = document.createElement("option");
        handicap_option_12.setAttribute("value", "12");
        handicap_option_12.appendChild(document.createTextNode("12"));

        var handicap_option_13 = document.createElement("option");
        handicap_option_13.setAttribute("value", "13");
        handicap_option_13.appendChild(document.createTextNode("13"));

        var handicap_select = document.createElement("select");
        handicap_select.setAttribute("name", "handicap");
        handicap_select.appendChild(handicap_option_0);
        handicap_select.appendChild(handicap_option_2);
        handicap_select.appendChild(handicap_option_3);
        handicap_select.appendChild(handicap_option_4);
        handicap_select.appendChild(handicap_option_5);
        handicap_select.appendChild(handicap_option_6);
        handicap_select.appendChild(handicap_option_7);
        handicap_select.appendChild(handicap_option_8);
        handicap_select.appendChild(handicap_option_9);
        handicap_select.appendChild(handicap_option_10);
        handicap_select.appendChild(handicap_option_11);
        handicap_select.appendChild(handicap_option_12);
        handicap_select.appendChild(handicap_option_13);

        var handicap_paragraph = document.createElement("p");
        handicap_paragraph.appendChild(document.createTextNode("Handicap: "));
        handicap_paragraph.appendChild(handicap_select);

        var handicap_section = document.createElement("section");
        handicap_section.setAttribute("class", "handicap_section");
        handicap_section.appendChild(handicap_paragraph);

        return handicap_section;
    }
            //<input type="text" name="prelude_name" placeholder="Enter your name"><button>Login</button>

    this.createConfigOpponentSection = function () {
        var data = ["aaa", "bbb", "ccc"];

        var opponent_option_0 = document.createElement("option");
        opponent_option_0.setAttribute("value", "Myself");
        opponent_option_0.appendChild(document.createTextNode("Myself"));

        var opponent_option_1 = document.createElement("option");
        opponent_option_1.setAttribute("value", "BBB");
        opponent_option_1.appendChild(document.createTextNode("bbbb"));

        var opponent_select = document.createElement("select");
        opponent_select.setAttribute("name", "opponent");
        opponent_select.appendChild(opponent_option_0);
        opponent_select.appendChild(opponent_option_1);

        var opponent_button = document.createElement("button");
        opponent_button.appendChild(document.createTextNode("Play"));

        var opponent_paragraph = document.createElement("p");
        opponent_paragraph.appendChild(document.createTextNode("Opponent: "));
        opponent_paragraph.appendChild(opponent_select);
        opponent_paragraph.appendChild(opponent_button);

        var config_opponent_section = document.createElement("section");
        config_opponent_section.setAttribute("class", "opponent_section");
        config_opponent_section.appendChild(opponent_paragraph);

        return config_opponent_section;
    };

    this.createConfigOpponentSection1 = function () {
        var opponent_paragraph = document.createElement("p");
        var opponent_input = document.createElement("input");
        var opponent_button = document.createElement("button");
        opponent_button.appendChild(document.createTextNode("Play"));
        opponent_input.setAttribute("type", "text");
        opponent_input.setAttribute("name", "opponent_name");
        opponent_input.setAttribute("placeholder", "Enter opponent's name");

        opponent_paragraph.appendChild(document.createTextNode("Opponent: "));
        opponent_paragraph.appendChild(opponent_input);
        opponent_paragraph.appendChild(opponent_button);

        var config_opponent_section = document.createElement("section");
        config_opponent_section.setAttribute("type", "text");
        config_opponent_section.setAttribute("class", "opponent_section");
        config_opponent_section.appendChild(opponent_paragraph);

        return config_opponent_section;
    };

    this.createConfigHolder = function () {
        if (this.configHolderOn()) {
            return;
        }
        this.setConfigHolderOn(true);

        var config_holder = document.createElement("section");
        config_holder.setAttribute("id", "config_holder");
        config_holder.setAttribute("class", "config_holder");
        config_holder.appendChild(this.createConfigMyNameSection());
        config_holder.appendChild(this.createConfigBoardSizeSection());
        config_holder.appendChild(this.createConfigPlayColorSection());
        config_holder.appendChild(this.createConfigKomiSection());
        config_holder.appendChild(this.createConfigHandicapSection());
        config_holder.appendChild(this.createConfigOpponentSection());

        var main_holder = document.getElementById("body");
        main_holder.appendChild(config_holder);

        this.setHolderStyle(config_holder);
    };

    this.removeConfigHolder = function () {
        if (!this.configHolderOn()) {
            return;
        }
        this.setConfigHolderOn(false);

        var main_holder = document.getElementById("body");
        var config_holder = document.getElementById("config_holder");
        main_holder.removeChild(config_holder);

    };

    this.createCanvasHolder = function () {
        if (this.canvasHolderOn()) {
            return;
        }
        this.setCanvasHolderOn(true);

        var canvas_element = document.createElement("canvas");
        canvas_element.setAttribute("id", "goCanvas");
        canvas_element.setAttribute("style", "border:1px solid #000000;");
        canvas_element.width = this.canvasWidth();
        canvas_element.height = this.canvasWidth() * 1.1;

        var canvas_section = document.createElement("section");
        canvas_section.setAttribute("id", "canvas-area1");
        canvas_section.appendChild(canvas_element);

        var canvas_holder = document.createElement("canvas_holder");
        canvas_holder.setAttribute("id", "canvas_holder");
        canvas_holder.appendChild(canvas_element);

        var main_holder = document.getElementById("body");
        main_holder.appendChild(canvas_holder);
     };

    this.removeCanvasHolder = function () {
        if (!this.canvasHolderOn()) {
            return;
        }
        this.setCanvasHolderOn(false);

        var main_holder = document.getElementById("body");
        var canvas_holder = document.getElementById("canvas_holder");
        main_holder.removeChild(canvas_holder);
    };

    this.createScoreHolder = function () {
        if (this.scoreHolderOn()) {
            return;
        }
        this.setScoreHolderOn(true);

        var black_score_paragraph = document.createElement("p");
        black_score_paragraph.appendChild(document.createTextNode("Black: 0"));
        var black_section = document.createElement("section");
        black_section.setAttribute("id", "black_score");
        black_section.appendChild(black_score_paragraph);

        var white_score_paragraph = document.createElement("p");
        white_score_paragraph.appendChild(document.createTextNode("White: 0"));
        var white_section = document.createElement("section");
        white_section.setAttribute("id", "white_score");
        white_section.appendChild(white_score_paragraph);

        var score_holder = document.createElement("score_holder");
        score_holder.setAttribute("id", "score_holder");
        score_holder.appendChild(black_section);
        score_holder.appendChild(white_section);

        var main_holder = document.getElementById("body");
        main_holder.appendChild(score_holder);

        this.setHolderStyle(score_holder);
        //this.setSectionStyleLeft(black_section);
        //this.setSectionStyleLeft(white_section);
    };

    this.removeScoreHolder = function () {
        if (!this.scoreHolderOn()) {
            return;
        }
        this.setScoreHolderOn(false);

        var main_holder = document.getElementById("body");
        var score_holder = document.getElementById("score_holder");
        main_holder.removeChild(score_holder);
    };

    this.setHolderStyle = function (holder_val) {
        holder_val.style.margin = "10px";
        holder_val.style.background = "lightcyan";
        holder_val.style.border = "1px solid blue";
        holder_val.style.overflow = "auto";
    };

    this.setSectionStyleLeft = function (holder_val) {
        holder_val.style.margin = "10px";
        holder_val.style.width = "500px";
        //holder_val.style.border = "1px solid green";
        holder_val.style.float = "left";
    };

    this.setSectionStyleRight = function (holder_val) {
        holder_val.style.margin = "10px";
        holder_val.style.width = "500px";
        //holder_val.style.border = "1px solid green";
        holder_val.style.float = "right";
    };

    this.setParagraphStyle = function (p_val) {
        p_val.style.background = "pink";
    };

    this.setH1Style = function (val) {
        //val.style.margin = "10px";
        //val.style.border = "1px solid red";
        val.style.float = "left";
    };

    this.createPreludeHolders = function () {
        this.removeAllHolders();
        this.createPreludeHolder();
    };

    this.createSessionHolders = function (session_val) {
        this.removeAllHolders(session_val);
        this.createSessionHolder(session_val);
    };

    this.createConfigHolders = function () {
        this.removeAllHolders(null);
        this.createConfigHolder();
    };

    this.createPlayHolders = function () {
        this.removeAllHolders(null);
        this.createCanvasHolder();
        this.createScoreHolder();
    };

    this.removeAllHolders = function (val) {
        this.removePreludeHolder();
        this.removeTitleHolder();
        this.removeSessionHolder(val);
        this.removeConfigHolder();
        this.removeCanvasHolder();
        this.removeScoreHolder();
    };

    this.abend = function (str1_val, str2_val) {
        return this.utilObject().utilAbend("GoHtmlObject." + str1_val, str2_val);
    };

    this.logit = function (str1_val, str2_val) {
        return this.utilObject().utilLogit("GoHtmlObject." + str1_val, str2_val);
    };

    //this.createTitleHolder();
}
