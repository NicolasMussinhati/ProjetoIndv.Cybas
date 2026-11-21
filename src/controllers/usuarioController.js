var crypto = require("crypto");
var usuarioModel = require("../models/usuarioModel");

// a senha nunca vai pura para o banco
function criptografar(senha) {
    return crypto.createHash("sha256").update(senha).digest("hex");
}

function cadastrar(req, res) {
    var nome = req.body.nome, email = req.body.email, senha = req.body.senha;

    if (!nome || !email || !senha || senha.length < 6 || nome.length > 60 || email.length > 100) {
        return res.status(400).json({ erro: "Dados inválidos." });
    }
    usuarioModel.buscarPorEmail(email)
        .then(function (existentes) {
            if (existentes.length > 0) {
                return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
            }
            return usuarioModel.cadastrar(nome, email, criptografar(senha))
                .then(function () { res.status(201).json({ mensagem: "Conta criada." }); });
        })
        .catch(function (erro) { console.log(erro); res.status(500).json({ erro: "Erro no servidor." }); });
}

function autenticar(req, res) {
    var email = req.body.email, senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Preencha e-mail e senha." });
    }
    usuarioModel.autenticar(email, criptografar(senha))
        .then(function (resultado) {
            if (resultado.length != 1) { return res.status(401).json({ erro: "E-mail ou senha incorretos." }); }
            var usuario = resultado[0];
            return usuarioModel.ultimoAcesso(usuario.id)
                .then(function (r) { usuario.ultimoAcesso = r[0].ultimo; return usuarioModel.registrarAcesso(usuario.id); })
                .then(function () { res.json(usuario); });
        })
        .catch(function (erro) { console.log(erro); res.status(500).json({ erro: "Erro no servidor." }); });
}
module.exports = { cadastrar, autenticar };
