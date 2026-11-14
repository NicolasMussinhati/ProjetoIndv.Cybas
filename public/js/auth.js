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
  else if (buscarPosicaoPorEmail(email) != -1) { mensagem.innerHTML = "Este e-mail já está cadastrado."; }
  else {
    adicionarUsuario(nome, email, senha);
    mensagem.innerHTML = "Conta criada! Redirecionando...";
    setTimeout(function () { window.location = "login.html"; }, 1500);
  }
}
function entrar() {
  var email = input_email.value, senha = input_senha.value;
  var posicao = buscarPosicaoPorEmail(email);
  if (email == "" || senha == "") { mensagem.innerHTML = "Preencha e-mail e senha."; }
  else if (posicao == -1) { mensagem.innerHTML = "E-mail não cadastrado."; }
  else if (pegarSenha(posicao) != senha) { mensagem.innerHTML = "Senha incorreta."; }
  else {
    sessionStorage.NOME_USUARIO = pegarNome(posicao);
    sessionStorage.EMAIL_USUARIO = email;
    window.location = "simulador.html";
  }
}
