// Medidor de profundidade: mostra o nível atual e a "profundidade" conforme a pessoa rola a página
var ids = ["topo", "nivel1", "nivel2", "nivel3", "nivel4"];
var numeros = ["00", "01", "02", "03", "04"];

function atualizar() {
  var rolagem = window.pageYOffset;
  var total = document.body.scrollHeight - window.innerHeight;
  var porcentagem = 0;
  if (total > 0) { porcentagem = Math.round(rolagem * 100 / total); }
  if (porcentagem > 100) { porcentagem = 100; }

  document.getElementById("preenchimento").style.height = porcentagem + "%";
  document.getElementById("profundidade").innerHTML = Math.round(porcentagem * 20.77) + " m";   // 100% = 2077 m

  var atual = 0;
  for (var i = 0; i < ids.length; i++) {
    var secao = document.getElementById(ids[i]);
    if (secao.offsetTop <= rolagem + window.innerHeight / 2) { atual = i; }
  }
  document.getElementById("nivelAtual").innerHTML = "NÍVEL " + numeros[atual];
}

window.onscroll = atualizar;
atualizar();
