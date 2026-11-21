var express = require("express");
var router = express.Router();
var c = require("../controllers/questionarioController");

router.post("/salvar", function (req, res) { c.salvar(req, res); });
router.get("/resultado/:idQuestionario/:idUsuario", function (req, res) { c.resultado(req, res); });
router.get("/curva/:idQuestionario/:idUsuario", function (req, res) { c.curva(req, res); });
router.get("/fatores/:idQuestionario/:idUsuario", function (req, res) { c.fatores(req, res); });
router.get("/beneficios/:idQuestionario/:idUsuario", function (req, res) { c.beneficios(req, res); });
router.get("/dimensoes/:idQuestionario/:idUsuario", function (req, res) { c.dimensoes(req, res); });
router.get("/historico/:idUsuario", function (req, res) { c.historico(req, res); });
module.exports = router;
