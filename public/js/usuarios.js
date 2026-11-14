// Usuários em 3 vetores paralelos (nomes, emails, senhas), guardados como texto separado por "|".
// Quando o banco de dados chegar, só este arquivo precisa mudar.
function carregarLista(chave) {
  var texto = localStorage.getItem(chave);
  if (texto == null || texto == "") { return []; }
  return texto.split("|");
}
function salvarLista(chave, lista) { localStorage.setItem(chave, lista.join("|")); }
function buscarPosicaoPorEmail(email) {
  var emails = carregarLista("emails");
  for (var i = 0; i < emails.length; i++) {
    if (emails[i] == email) { return i; }
  }
  return -1;
}
function pegarNome(posicao) { return carregarLista("nomes")[posicao]; }
function pegarSenha(posicao) { return carregarLista("senhas")[posicao]; }
function adicionarUsuario(nome, email, senha) {
  var nomes = carregarLista("nomes");
  var emails = carregarLista("emails");
  var senhas = carregarLista("senhas");
  nomes.push(nome); emails.push(email); senhas.push(senha);
  salvarLista("nomes", nomes); salvarLista("emails", emails); salvarLista("senhas", senhas);
}
