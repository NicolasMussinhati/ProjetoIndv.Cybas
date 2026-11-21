var database = require("../database/config");
var mysql = require("mysql2");   // mysql.escape protege os textos contra SQL injection

function buscarPorEmail(email) {
    return database.executar("SELECT id FROM usuario WHERE email = " + mysql.escape(email) + ";");
}
function autenticar(email, senha) {
    return database.executar("SELECT id, nome, email FROM usuario WHERE email = " + mysql.escape(email) + " AND senha = " + mysql.escape(senha) + ";");
}
function cadastrar(nome, email, senha) {
    return database.executar("INSERT INTO usuario (nome, email, senha) VALUES (" + mysql.escape(nome) + ", " + mysql.escape(email) + ", " + mysql.escape(senha) + ");");
}
function ultimoAcesso(idUsuario) {
    return database.executar("SELECT MAX(data_hora) AS ultimo FROM acesso WHERE fk_usuario = " + idUsuario + ";");
}
function registrarAcesso(idUsuario) {
    return database.executar("INSERT INTO acesso (fk_usuario) VALUES (" + idUsuario + ");");
}
module.exports = { buscarPorEmail, autenticar, cadastrar, ultimoAcesso, registrarAcesso };
