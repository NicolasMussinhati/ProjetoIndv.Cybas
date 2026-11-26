function campoVazio(campos) {
  for (var i = 0; i < campos.length; i++) {
    if (campos[i] == "") { return true; }
  }
  return false;
}

function temBarra(campos) {
  for (var i = 0; i < campos.length; i++) {
    for (var j = 0; j < campos[i].length; j++) {
      if (campos[i][j] == "|") { return true; }
    }
  }
  return false;
}

function emailValido(email) {
  var temArroba = false, temPonto = false, i = 0;
  while (i < email.length) {
    if (email[i] == "@") { temArroba = true; }
    if (email[i] == ".") { temPonto = true; }
    i++;
  }
  return temArroba && temPonto;
}

function cadastrar() {
  var nome = input_nome.value, email = input_email.value, senha = input_senha.value;
  if (campoVazio([nome, email, senha])) { mensagem.innerHTML = "Preencha todos os campos."; }
  else if (temBarra([nome, email, senha])) { mensagem.innerHTML = "Não use o caractere | nos campos."; }
  else if (!emailValido(email)) { mensagem.innerHTML = "Digite um e-mail válido."; }
  else if (senha.length < 6) { mensagem.innerHTML = "A senha precisa ter pelo menos 6 caracteres."; }
  else {
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome, email: email, senha: senha })
    })
      .then(function (r) {
        if (!r.ok) { return r.json().then(function (err) { throw new Error(err.erro); }); }
        mensagem.innerHTML = "Conta criada! Redirecionando...";
        setTimeout(function () { window.location = "login.html"; }, 1500);
      })
      .catch(function (erro) {
        console.log(erro);
        mensagem.innerHTML = erro.message || "Erro ao cadastrar.";
      });
  }
}

function entrar() {
  var email = input_email.value, senha = input_senha.value;
  if (email == "" || senha == "") { mensagem.innerHTML = "Preencha e-mail e senha."; }
  else {
    fetch("/usuarios/autenticar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha })
    })
      .then(function (r) {
        if (!r.ok) { return r.json().then(function (err) { throw new Error(err.erro); }); }
        return r.json();
      })
      .then(function (dados) {
        sessionStorage.ID_USUARIO = dados.id;
        sessionStorage.NOME_USUARIO = dados.nome;
        sessionStorage.EMAIL_USUARIO = dados.email;
        window.location = "simulador.html";
      })
      .catch(function (erro) {
        console.log(erro);
        mensagem.innerHTML = erro.message || "Erro ao entrar.";
      });
  }
}