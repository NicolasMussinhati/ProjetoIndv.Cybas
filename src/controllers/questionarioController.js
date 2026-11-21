var questionarioModel = require("../models/questionarioModel");

// ids de implantes: 1 a 12, sem repetir
function implantesValidos(v) {
    if (!Array.isArray(v) || v.length == 0 || v.length > 12) { return false; }
    for (var i = 0; i < v.length; i++) {
        if (!Number.isInteger(v[i]) || v[i] < 1 || v[i] > 12) { return false; }
        for (var j = 0; j < i; j++) { if (v[j] == v[i]) { return false; } }
    }
    return true;
}
// 7 opções, uma por pergunta: a pergunta p só aceita os ids de p*3+1 a p*3+3
function opcoesValidas(v) {
    if (!Array.isArray(v) || v.length != 7) { return false; }
    for (var p = 0; p < 7; p++) {
        if (!Number.isInteger(v[p]) || v[p] < p * 3 + 1 || v[p] > p * 3 + 3) { return false; }
    }
    return true;
}

function salvar(req, res) {
    var idUsuario = Number(req.body.idUsuario), implantes = req.body.implantes, opcoes = req.body.opcoes, idQ;

    if (!Number.isInteger(idUsuario) || idUsuario < 1) { return res.status(400).json({ erro: "Usuário inválido." }); }
    if (!implantesValidos(implantes)) { return res.status(400).json({ erro: "Escolha de 1 a 12 implantes." }); }
    if (!opcoesValidas(opcoes)) { return res.status(400).json({ erro: "Responda as 7 perguntas." }); }

    questionarioModel.criar(idUsuario)
        .then(function (r) { idQ = r.insertId; return questionarioModel.salvarImplantes(idQ, implantes); })
        .then(function () { return questionarioModel.salvarRespostas(idQ, opcoes); })
        .then(function () { res.status(201).json({ idQuestionario: idQ }); })
        .catch(function (erro) {
            console.log(erro);
            if (idQ) { questionarioModel.apagar(idQ).catch(function (e) { console.log(e); }); }   // não deixa avaliação pela metade
            res.status(500).json({ erro: "Não foi possível salvar." });
        });
}

// as 4 consultas do dashboard seguem o mesmo padrão
function consultar(funcaoModel) {
    return function (req, res) {
        var idQ = Number(req.params.idQuestionario), idUsuario = Number(req.params.idUsuario);
        if (!Number.isInteger(idQ) || !Number.isInteger(idUsuario)) { return res.status(400).json({ erro: "Parâmetros inválidos." }); }
        funcaoModel(idQ, idUsuario)
            .then(function (linhas) { res.json(linhas); })
            .catch(function (erro) { console.log(erro); res.status(500).json({ erro: "Erro no servidor." }); });
    };
}
function historico(req, res) {
    var idUsuario = Number(req.params.idUsuario);
    if (!Number.isInteger(idUsuario)) { return res.status(400).json({ erro: "Usuário inválido." }); }
    questionarioModel.historico(idUsuario)
        .then(function (linhas) { res.json(linhas); })
        .catch(function (erro) { console.log(erro); res.status(500).json({ erro: "Erro no servidor." }); });
}
module.exports = {
    salvar: salvar, historico: historico,
    resultado: consultar(questionarioModel.resultado),
    curva: consultar(questionarioModel.curva),
    fatores: consultar(questionarioModel.fatores),
    beneficios: consultar(questionarioModel.beneficios),
    dimensoes: consultar(questionarioModel.dimensoes)
};
