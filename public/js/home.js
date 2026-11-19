// Medidor de profundidade: uma pessoa que enche conforme a pessoa rola a página.
// Quanto mais fundo, mais os olhos crescem, saem do rosto e pulsam mais rápido.
var ids = ["topo", "nivel1", "nivel2", "nivel3", "nivel4"];
var numeros = ["00", "01", "02", "03", "04"];
var corRasa = [0, 229, 255];     // cor da pessoa na superfície (ciano)
var corFunda = [255, 30, 60];    // cor da pessoa no fundo (vermelho)

// mistura as duas cores: i = 0 dá a cor rasa, i = 1 dá a cor funda
function misturarCor(i) {
  var canais = [];
  for (var k = 0; k < 3; k++) {
    canais.push(Math.round(corRasa[k] + (corFunda[k] - corRasa[k]) * i));
  }
  return "rgb(" + canais.join(",") + ")";
}

function atualizarPessoa(porcentagem) {
  var i = porcentagem / 100;        // 0 a 1
  var forca = i * i;                // o efeito é fraco no começo e forte no fundo

  // 1) enchimento: o retângulo sobe de baixo para cima
  var altura = 160 * i;
  var recorte = document.getElementById("recorteRect");
  recorte.setAttribute("y", 160 - altura);
  recorte.setAttribute("height", altura);
  document.getElementById("pessoaCheia").setAttribute("fill", misturarCor(i));

  // 2) olhos: crescem e se afastam do centro do rosto (saem para fora)
  var raio = 1.8 + 5.2 * forca;
  var espessura = 0.4 + 1.2 * forca;
  var verde = Math.round(255 - 150 * forca);   // o branco do olho vai ficando avermelhado
  var azul = Math.round(255 - 140 * forca);
  var lados = ["E", "D"];
  var posicoes = [23.5 - 2.5 * forca, 36.5 + 2.5 * forca];
  for (var n = 0; n < lados.length; n++) {
    var olho = document.getElementById("olho" + lados[n]);
    var pupila = document.getElementById("pupila" + lados[n]);
    olho.setAttribute("r", raio);
    olho.setAttribute("cx", posicoes[n]);
    olho.setAttribute("stroke-width", espessura);
    olho.setAttribute("fill", "rgb(255," + verde + "," + azul + ")");
    pupila.setAttribute("r", 0.7 + raio * 0.12);
    pupila.setAttribute("cx", posicoes[n]);
  }

  // 3) velocidade: a pulsação vai de 1,8 s (calma) até 0,15 s (frenética)
  var pulsos = document.getElementsByClassName("pulso");
  for (var p = 0; p < pulsos.length; p++) {
    pulsos[p].style.animationDuration = (1.8 - 1.65 * i) + "s";
  }

  // 4) efetividade: a pulsação fica maior, o corpo treme e o brilho vermelho aumenta
  var pessoa = document.getElementById("pessoa");
  var tremor = 0;
  if (i > 0.4) { tremor = (i - 0.4) * 5; }     // só começa a tremer depois de 40%
  pessoa.style.setProperty("--pulso", 1.05 + 0.3 * forca);
  pessoa.style.setProperty("--tremor", tremor + "px");
  pessoa.style.animationDuration = (0.5 - 0.4 * i) + "s";
  pessoa.style.filter = "drop-shadow(0 0 " + (2 + 8 * forca) + "px rgba(255,42,109," + (0.3 + 0.7 * i) + "))";
}

function atualizar() {
  var rolagem = window.pageYOffset;
  var total = document.body.scrollHeight - window.innerHeight;
  var porcentagem = 0;
  if (total > 0) { porcentagem = Math.round(rolagem * 100 / total); }
  if (porcentagem > 100) { porcentagem = 100; }

  atualizarPessoa(porcentagem);
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