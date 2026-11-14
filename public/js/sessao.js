// destino = caminho da página de login a partir da página atual
function validarSessao(destino) {
  if (sessionStorage.NOME_USUARIO == undefined) { window.location = destino; }
}
function sair(destino) {
  sessionStorage.clear();
  window.location = destino;
}
