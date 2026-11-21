var database = require("../database/config");
// Todos os valores aqui já foram convertidos em número pelo controller.

function criar(idUsuario) {
    return database.executar("INSERT INTO questionario (fk_usuario) VALUES (" + idUsuario + ");");
}
function salvarImplantes(idQ, implantes) {
    var linhas = [];
    for (var i = 0; i < implantes.length; i++) { linhas.push("(" + idQ + ", " + implantes[i] + ")"); }   // ordem preservada pelo id
    return database.executar("INSERT INTO questionario_implante (fk_questionario, fk_implante) VALUES " + linhas.join(", ") + ";");
}
// cada linha: avaliação, pergunta (posição + 1) e opção escolhida
function salvarRespostas(idQ, opcoes) {
    var linhas = [];
    for (var i = 0; i < opcoes.length; i++) { linhas.push("(" + idQ + ", " + (i + 1) + ", " + opcoes[i] + ")"); }
    return database.executar("INSERT INTO questionario_resposta (fk_questionario, fk_pergunta, fk_opcao) VALUES " + linhas.join(", ") + ";");
}
// desfaz uma avaliação incompleta (filhos primeiro, depois o questionário)
function apagar(idQ) {
    return database.executar("DELETE FROM questionario_implante WHERE fk_questionario = " + idQ + ";")
        .then(function () { return database.executar("DELETE FROM questionario_resposta WHERE fk_questionario = " + idQ + ";"); })
        .then(function () { return database.executar("DELETE FROM questionario WHERE id = " + idQ + ";"); });
}
// as consultas exigem o usuário dono da avaliação
function resultado(idQ, idUsuario) {
    return database.executar("SELECT * FROM vw_resultado WHERE id_questionario = " + idQ + " AND id_usuario = " + idUsuario + ";");
}
function curva(idQ, idUsuario) {
    return database.executar("SELECT c.ordem, c.nome, c.descricao, c.custo_humanidade, c.carga_acumulada FROM vw_curva c " +
        "JOIN questionario q ON q.id = c.fk_questionario WHERE c.fk_questionario = " + idQ + " AND q.fk_usuario = " + idUsuario + " ORDER BY c.ordem;");
}
function fatores(idQ, idUsuario) {
    return database.executar("SELECT f.dimensao, f.pergunta, f.resposta, f.nivel_risco, f.explicacao FROM vw_fatores f " +
        "JOIN questionario q ON q.id = f.fk_questionario WHERE f.fk_questionario = " + idQ + " AND q.fk_usuario = " + idUsuario + ";");
}
function historico(idUsuario) {
    return database.executar("SELECT id_questionario, data_resposta, qtd_implantes, percentual_cyberpsicose, status_risco " +
        "FROM vw_resultado WHERE id_usuario = " + idUsuario + " ORDER BY data_resposta DESC, id_questionario DESC LIMIT 10;");
}
function beneficios(idQ, idUsuario) {
    return database.executar("SELECT b.beneficio, b.implantes_que_dao FROM vw_beneficios b " +
        "JOIN questionario q ON q.id = b.fk_questionario WHERE b.fk_questionario = " + idQ + " AND q.fk_usuario = " + idUsuario + " ORDER BY b.implantes_que_dao DESC, b.beneficio;");
}
function dimensoes(idQ, idUsuario) {
    return database.executar("SELECT r.dimensao, r.risco_percentual FROM vw_risco_dimensao r " +
        "JOIN questionario q ON q.id = r.fk_questionario WHERE r.fk_questionario = " + idQ + " AND q.fk_usuario = " + idUsuario + ";");
}
module.exports = { criar, salvarImplantes, salvarRespostas, apagar, resultado, curva, fatores, historico, beneficios, dimensoes };
