// Medidor de profundidade: uma pessoa que enche conforme a pessoa rola a página.
// Quanto mais fundo: os olhos arregalam, a imagem se duplica em "ecos", o corpo racha e treme.
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

  // 2) olhos arregalados: ficam maiores e se afastam do centro; a pupila dourada encolhe
  var raio = 1.8 + 5.2 * forca;
  var lados = ["E", "D"];
  var posicoes = [23.5 - 2.5 * forca, 36.5 + 2.5 * forca];
  for (var n = 0; n < lados.length; n++) {
    var olho = document.getElementById("olho" + lados[n]);
    var pupila = document.getElementById("pupila" + lados[n]);
    olho.setAttribute("r", raio);
    olho.setAttribute("cx", posicoes[n]);
    olho.setAttribute("stroke-width", 0.5 + 0.6 * forca);
    olho.setAttribute("fill", "rgb(" + Math.round(235 + 20 * forca) + "," + Math.round(230 - 90 * forca) + "," + Math.round(225 - 85 * forca) + ")");
    pupila.setAttribute("r", raio * (0.26 - 0.08 * forca));
    pupila.setAttribute("cx", posicoes[n]);
  }

  // 3) rachaduras: aparecem depois de 30% de profundidade
  var rachaduras = 0;
  if (i > 0.3) { rachaduras = (i - 0.3) / 0.7; }
  document.getElementById("rachaduras").setAttribute("opacity", rachaduras);

  // 4) ecos: cópias que se afastam (--eco) e vibram mais rápido; ficam mais visíveis
  var pessoa = document.getElementById("pessoa");
  var ecos = document.getElementsByClassName("eco");     // eco3, eco2, eco1 (do mais longe ao mais perto)
  var opacidades = [0.25, 0.4, 0.6];
  for (var e = 0; e < ecos.length; e++) {
    var visivel = 0;
    if (i > 0.08) { visivel = opacidades[e] * (0.4 + 0.6 * i); }
    ecos[e].style.opacity = visivel;
    ecos[e].style.animationDuration = (1.4 - 1.15 * i) + "s";
  }
  pessoa.style.setProperty("--eco", 2 + 9 * i);

  // 5) tremor do corpo e brilho vermelho em volta
  var tremor = 0;
  if (i > 0.4) { tremor = (i - 0.4) * 5; }     // só começa a tremer depois de 40%
  pessoa.style.setProperty("--tremor", tremor + "px");
  pessoa.style.animationDuration = (0.5 - 0.4 * i) + "s";
  pessoa.style.filter = "drop-shadow(0 0 " + (2 + 8 * forca) + "px rgba(255,42,109," + (0.3 + 0.7 * i) + "))";

  var medidor = document.getElementById("medidor");
  medidor.style.boxShadow = "0 0 " + (4 + 30 * forca) + "px rgba(255,30,60," + (0.7 * forca) + ")";
  medidor.style.borderColor = misturarCor(forca);
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

var ids = ["topo", "nivel1", "nivel2", "nivel3", "nivel4", "nivel5"];
var numeros = ["00", "01", "02", "03", "04", "05"];

