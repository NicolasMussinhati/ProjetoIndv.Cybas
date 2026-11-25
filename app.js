// Escolha do ambiente: 'desenvolvimento' lê o .env.dev, 'producao' lê o .env
//var ambiente_processo = 'desenvolvimento';   // Windows
 var ambiente_processo = 'producao';        // VM

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

// rotas do CyberPsico
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var questionarioRouter = require("./src/routes/questionarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/questionarios", questionarioRouter);

app.listen(PORTA_APP, function () {
    console.log("Servidor rodando em http://" + HOST_APP + ":" + PORTA_APP);
});