validarSessao("login.html");
document.getElementById("operador").innerHTML = "OPERADOR: " + sessionStorage.NOME_USUARIO;

var escolhidos = [];
var respostas = [0,0,0,0,0,0,0];
var respondidas = [false,false,false,false,false,false,false];

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

  var idUsuario = Number(sessionStorage.ID_USUARIO);
  var implantesIds = [];
  for (var i = 0; i < escolhidos.length; i++) {
    implantesIds.push(escolhidos[i] + 1);
  }
  var opcoesIds = [];
  for (var p = 0; p < respostas.length; p++) {
    opcoesIds.push(p * 3 + respostas[p] + 1);
  }

  sessionStorage.ESCOLHIDOS = escolhidos.join(",");
  sessionStorage.RESPOSTAS = respostas.join(",");

  fetch("/questionarios/salvar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: idUsuario,
      implantes: implantesIds,
      opcoes: opcoesIds
    })
  })
    .then(function (r) {
      if (!r.ok) { return r.json().then(function (err) { throw new Error(err.erro); }); }
      return r.json();
    })
    .then(function (dados) {
      sessionStorage.ID_QUESTIONARIO = dados.idQuestionario;
      window.location = "dashboard/dashboard.html";
    })
    .catch(function (erro) {
      console.log(erro);
      document.getElementById("erro2").innerHTML = erro.message || "Erro ao salvar.";
    });
}