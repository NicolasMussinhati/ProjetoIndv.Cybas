// Dados do simulador (vetores). A mesma posição = mesmo implante.
var impNomes = ["Sandevistan","Cyberdeck","Lâminas Louva-a-Deus","Monofio","Braços de Gorila","Armadura Subdérmica","Óticas Kiroshi","Tendões Reforçados","Esqueleto de Titânio","Bomba de Sangue","Link Inteligente","Pulmões Biônicos"];
var impPontos = [25,18,15,14,12,10,6,8,16,9,7,7];
var impDesc = [
  "Reage a um objeto que cai ou a um imprevisto no trânsito com reflexos acelerados.",
  "Interage com redes e sistemas autorizados no trabalho e resolve burocracia digital.",
  "Corta materiais resistentes em trabalhos manuais; as lâminas exigem cuidado perto de outras pessoas.",
  "Corta materiais em reparos e reformas; seu fio é extremamente afiado.",
  "Carrega compras pesadas, move móveis e faz trabalhos que exigem força física.",
  "Dá proteção extra contra impactos em quedas, acidentes e trabalhos fisicamente arriscados.",
  "Dá zoom e amplia detalhes de uma peça ou pessoa; ajuda a enxergar melhor no escuro.",
  "Dá mais agilidade em corridas e saltos; evita lesões em esforços repetitivos.",
  "Sustenta mais peso ao carregar ferramentas, bagagens ou materiais de trabalho.",
  "Ajuda na recuperação após ferimentos e reduz o impacto de um acidente na rotina.",
  "Ajuda a mirar com mais precisão em trabalhos de risco e na defesa pessoal.",
  "Dá mais fôlego ao subir escadas, correr ou praticar atividades físicas."
];
// Perguntas de saúde mental: opções em ordem do MENOR para o MAIOR risco (0, 1, 2)
var perguntas = ["Estabilidade emocional","Estresse cotidiano","Qualidade do sono","Histórico de traumas urbanos","Rede de apoio","Uso de álcool ou estimulantes","Acompanhamento psicológico"];
var opcoes = [
  ["Alta","Moderada","Baixa"],
  ["Baixo","Moderado","Alto"],
  ["Durmo bem (7h+)","Sono irregular","Durmo muito mal"],
  ["Nenhum","Pontual","Recorrente"],
  ["Rede presente","Apoio ocasional","Isolamento"],
  ["Nunca","Às vezes","Frequente"],
  ["Regular","Raro","Nunca"]
];
var dicas = [
  "Quem já oscila muito de humor tem menos margem: cada implante pesa mais no cérebro.",
  "Estresse constante mantém o sistema nervoso em alerta e reduz a tolerância ao cromo.",
  "É dormindo que o cérebro se recupera. Sem sono, a sobrecarga dos implantes se acumula.",
  "Traumas repetidos deixam marcas. O corpo reage como se o perigo nunca acabasse.",
  "Pessoas por perto trazem você de volta à realidade. O isolamento tira esse freio.",
  "Substâncias mascaram os sintomas e deixam a mente ainda mais instável.",
  "Quem tem acompanhamento percebe os sinais cedo e age antes do surto."
];
