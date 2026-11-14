validarSessao("login.html");
document.getElementById("operador").innerHTML = "OPERADOR: " + sessionStorage.NOME_USUARIO;

var escolhidos = [];                 // posições dos implantes, na ordem em que foram marcados
var respostas = [0,0,0,0,0,0,0];     // 0, 1 ou 2 para cada pergunta
var respondidas = [false,false,false,false,false,false,false];

// ----- Etapa 1: implantes -----
var html = "";
for (var i = 0; i < impNomes.length; i++) {
  html += '<label class="caixa implante" id="imp' + i + '"><input type="checkbox" onchange="marcarImplante(' + i + ', this.checked)">';
  html += '<b>' + impNomes[i] + '</b> <span class="carga">Carga +' + impPontos[i] + '</span><br>' + impDesc[i] + '</label>';
}
document.getElementById("listaImplantes").innerHTML = html;

function marcarImplante(posicao, marcado) {
  var caixa = document.getElementById("imp" + posicao);
  if (marcado) {
    escolhidos.push(posicao);
    caixa.className = "caixa implante marcado";
  } else {
    var novo = [];
    for (var i = 0; i < escolhidos.length; i++) {
      if (escolhidos[i] != posicao) { novo.push(escolhidos[i]); }
    }
    escolhidos = novo;
    caixa.className = "caixa implante";
  }
  document.getElementById("contador").innerHTML = escolhidos.length + " / " + impNomes.length;
}
function irParaPerfil() {
  if (escolhidos.length == 0) { document.getElementById("erro1").innerHTML = "Escolha pelo menos 1 implante."; return; }
  document.getElementById("etapa1").className = "escondido";
  document.getElementById("etapa2").className = "";
}
function voltar() {
  document.getElementById("etapa2").className = "escondido";
  document.getElementById("etapa1").className = "";
}

// ----- Etapa 2: perguntas -----
var html2 = "";
for (var p = 0; p < perguntas.length; p++) {
  html2 += '<h3>' + perguntas[p] + '</h3><div>';
  for (var o = 0; o < 3; o++) {
    html2 += '<label class="opcao" id="op' + p + '_' + o + '"><input type="radio" name="perg' + p + '" onclick="responder(' + p + ',' + o + ')">' + opcoes[p][o] + '</label>';
  }
  html2 += '</div><p class="dica">Por que importa: ' + dicas[p] + '</p>';
}
document.getElementById("listaPerguntas").innerHTML = html2;

function responder(p, o) {
  respostas[p] = o;
  respondidas[p] = true;
  for (var k = 0; k < 3; k++) {
    document.getElementById("op" + p + "_" + k).className = (k == o) ? "opcao marcado" : "opcao";
  }
}
function processar() {
  for (var p = 0; p < respondidas.length; p++) {
    if (!respondidas[p]) { document.getElementById("erro2").innerHTML = "Responda todas as perguntas."; return; }
  }
  sessionStorage.ESCOLHIDOS = escolhidos.join(",");
  sessionStorage.RESPOSTAS = respostas.join(",");
  window.location = "dashboard/dashboard.html";
}
