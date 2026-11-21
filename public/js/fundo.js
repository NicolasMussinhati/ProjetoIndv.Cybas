// Chuva de dados no fundo: letras que caem em colunas e deixam um rastro.
// Quanto maior window.intensidadeFundo (0 a 1), mais rápida, mais visível e mais vermelha ela fica.
// A home atualiza esse valor conforme a profundidade; nas outras páginas ele fica em 0.
if (window.intensidadeFundo === undefined) { window.intensidadeFundo = 0; }

var tela = document.createElement("canvas");
tela.id = "fundo";
document.body.insertBefore(tela, document.body.firstChild);
var pincel = tela.getContext("2d");

var letras = "01アイウエオカキクケコサシスセソ<>/[]{}#$%";
var tamanho = 16;                 // largura de cada coluna, em pixels
var gotas = [];                   // posição (em linhas) da letra mais nova de cada coluna
var corRasa = [0, 229, 255];      // ciano
var corFunda = [255, 30, 60];     // vermelho

function ajustarTela() {
  tela.width = window.innerWidth;
  tela.height = window.innerHeight;
  gotas = [];
  for (var i = 0; i < Math.floor(tela.width / tamanho); i++) {
    gotas.push(Math.random() * -50);       // começam espalhadas acima da tela
  }
}

function misturarCor(t) {
  var canais = [];
  for (var k = 0; k < 3; k++) { canais.push(Math.round(corRasa[k] + (corFunda[k] - corRasa[k]) * t)); }
  return "rgb(" + canais.join(",") + ")";
}

function desenhar() {
  if (document.hidden) { return; }                     // aba escondida: não gasta processamento
  var forca = window.intensidadeFundo;

  // apaga um pouco do que já foi desenhado: é isso que cria o rastro
  pincel.globalCompositeOperation = "destination-out";
  pincel.fillStyle = "rgba(0, 0, 0, 0.12)";
  pincel.fillRect(0, 0, tela.width, tela.height);
  pincel.globalCompositeOperation = "source-over";

  pincel.font = tamanho + "px monospace";
  var cor = misturarCor(forca);
  for (var i = 0; i < gotas.length; i++) {
    var letra = letras[Math.floor(Math.random() * letras.length)];
    pincel.fillStyle = (Math.random() < 0.03) ? "#ff2a6d" : cor;     // de vez em quando uma letra rosa
    pincel.fillText(letra, i * tamanho, gotas[i] * tamanho);
    if (gotas[i] * tamanho > tela.height && Math.random() > 0.975) { gotas[i] = 0; }   // volta ao topo
    gotas[i] += 0.5 + forca * 1.5;                                    // desce mais rápido no fundo
  }
  tela.style.opacity = 0.3 + 0.3 * forca;
}

ajustarTela();
window.onresize = ajustarTela;
// quem pediu menos animação não vê a chuva
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInterval(desenhar, 50); }