var express = require('express');
var bodyParser = require('body-parser');
var express_http = require('./express_http_module.js');
var app = express();
var util = require("./util_module.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/clients/go"));
app.post("/go_msg", express_http.post);
app.get("/go_msg", express_http.get);
app.use(express_http.not_found);
app.use(express_http.failure);
app.listen(8080);
