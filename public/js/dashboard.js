validarSessao("../login.html");
if (sessionStorage.ESCOLHIDOS == undefined) { window.location = "../simulador.html"; }
document.getElementById("operador").innerHTML = "RESULTADO: " + sessionStorage.NOME_USUARIO;

var escolhidos = sessionStorage.ESCOLHIDOS.split(",");
var respostas = sessionStorage.RESPOSTAS.split(",");

// ----- Cálculos -----
var carga = 0;
for (var i = 0; i < escolhidos.length; i++) { carga += impPontos[escolhidos[i]]; }

var penalidade = 0;
for (var i = 0; i < respostas.length; i++) { penalidade += Number(respostas[i]) * 5; }
var resistencia = 100 - penalidade;            // vai de 30 a 100

var saturacao = Math.round(carga * 100 / resistencia);
if (saturacao > 100) { saturacao = 100; }

var status, cor, titulo, texto;
if (saturacao < 40) {
  status = "Estável"; cor = "#00e5ff"; titulo = "Você ainda reconhece seu reflexo.";
  texto = "O cromo ainda funciona como ferramenta. Você enxerga Night City como ela é: perigosa, mas com pessoas dentro. Sente empatia, dorme sem barulho na cabeça e consegue parar quando quer.";
} else if (saturacao < 70) {
  status = "Alerta"; cor = "#ffc400"; titulo = "Algo começou a falhar.";
  texto = "As pessoas parecem mais lentas e mais barulhentas. Pequenas irritações viram explosões. Você ainda se reconhece, mas já precisa se esforçar para sentir o que sentia antes.";
} else if (saturacao < 90) {
  status = "Limite Crítico"; cor = "#ff7a00"; titulo = "A memória ainda é sua. A empatia, não.";
  texto = "Cada vantagem vem acompanhada de silêncio. O sucesso começa a parecer sobrevivência automática. Os outros viram obstáculos ou alvos, e a linha da culpa está próxima.";
} else {
  status = "Cyberpsicose"; cor = "#ff2a6d"; titulo = "Você passou do limite.";
  texto = "Para você, o mundo virou ruído e ameaça. Rostos viram alvos, nomes deixam de significar algo e a violência parece a única resposta clara. A MaxTac já está a caminho.";
}

// ----- KPIs -----
document.getElementById("kpiImplantes").innerHTML = escolhidos.length + " / " + impNomes.length;
document.getElementById("kpiSaturacao").innerHTML = saturacao + "%";
document.getElementById("kpiResistencia").innerHTML = "Resistência neural: " + resistencia + "/100";
var elStatus = document.getElementById("kpiStatus");
elStatus.innerHTML = status; elStatus.style.color = cor;
document.getElementById("tituloVisao").innerHTML = titulo;
document.getElementById("textoVisao").innerHTML = texto;

// ----- Gráfico de linhas (canvas) -----
var c = document.getElementById("grafico");
var g = c.getContext("2d");
var beneficios = [0], desgaste = [0], soma = 0;
for (var i = 0; i < escolhidos.length; i++) {
  soma += impPontos[escolhidos[i]];
  beneficios.push((i + 1) * 100 / impNomes.length);
  desgaste.push(Math.min(100, soma * 100 / resistencia));
}
g.strokeStyle = "#2c2c36"; g.fillStyle = "#888"; g.font = "12px monospace";
for (var k = 0; k <= 4; k++) {                  // linhas de fundo
  var yy = 230 - k * 50;
  g.beginPath(); g.moveTo(40, yy); g.lineTo(680, yy); g.stroke();
  g.fillText((k * 25) + "%", 5, yy + 4);
}
function desenharLinha(vetor, corLinha) {
  g.strokeStyle = corLinha; g.lineWidth = 3; g.beginPath();
  for (var i = 0; i < vetor.length; i++) {
    var x = 40 + i * 640 / (vetor.length - 1);
    var y = 230 - vetor[i] * 2;
    if (i == 0) { g.moveTo(x, y); } else { g.lineTo(x, y); }
  }
  g.stroke();
}
desenharLinha(beneficios, "#00e5ff");
desenharLinha(desgaste, "#ff2a6d");

// ----- Barras dos fatores de risco -----
var htmlF = "";
for (var p = 0; p < perguntas.length; p++) {
  var largura = Number(respostas[p]) * 50;
  htmlF += perguntas[p] + ": <b>" + opcoes[p][respostas[p]] + "</b><div class='barra'><div style='width:" + largura + "%'></div></div>";
}
document.getElementById("fatores").innerHTML = htmlF;

// ----- Lista de benefícios -----
var htmlB = "";
for (var i = 0; i < escolhidos.length; i++) {
  htmlB += "<div class='caixa'><h3>" + impNomes[escolhidos[i]] + "</h3>" + impDesc[escolhidos[i]] + "</div>";
}
document.getElementById("beneficios").innerHTML = htmlB;
