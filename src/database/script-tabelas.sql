CREATE DATABASE cyberpunk_db ;
USE cyberpunk_db;

-- ---------- USUÁRIOS ----------
-- Guarda quem tá usando o sistema e o login dele
CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1 usuário : N acessos (cada login com sucesso)
-- Cada vez que o usuário loga, ganha uma linha nova aqui
CREATE TABLE acesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_acesso_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

-- ---------- IMPLANTES ----------
-- Categorias fixas pros implantes (tipo "Braços", "Visão" etc.)
CREATE TABLE categoria_implante (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 1 categoria : N implantes
-- custo_humanidade tem que ser positivo pra fazer sentido na conta de saturação
CREATE TABLE implante (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_categoria INT NOT NULL,
    nome VARCHAR(80) NOT NULL UNIQUE,
    custo_humanidade INT NOT NULL,
    descricao VARCHAR(255),
    CONSTRAINT chk_custo_humanidade CHECK (custo_humanidade > 0),
    CONSTRAINT fk_implante_categoria FOREIGN KEY (fk_categoria) REFERENCES categoria_implante(id)
);

-- Lista de benefícios que um implante pode dar
CREATE TABLE beneficio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL UNIQUE
);

-- N implantes : N benefícios
-- Tabela de ligação porque um implante pode dar mais de um benefício e um benefício pode vir de vários implantes
CREATE TABLE implante_beneficio (
    fk_implante INT NOT NULL,
    fk_beneficio INT NOT NULL,
    PRIMARY KEY (fk_implante, fk_beneficio),
    CONSTRAINT fk_ib_implante FOREIGN KEY (fk_implante) REFERENCES implante(id),
    CONSTRAINT fk_ib_beneficio FOREIGN KEY (fk_beneficio) REFERENCES beneficio(id)
);

-- ---------- PERGUNTAS ----------
-- Áreas avaliadas no questionário (Emocional, Física, Social)
CREATE TABLE dimensao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL UNIQUE
);

-- 1 dimensão : N perguntas. "peso" = quanto cada nível de risco tira da resistência neural
-- Peso vai de 1 a 10 pra ninguém colocar valor maluco
CREATE TABLE pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_dimensao INT NOT NULL,
    texto VARCHAR(100) NOT NULL,
    explicacao VARCHAR(255) NOT NULL,
    peso TINYINT NOT NULL DEFAULT 5,
    CONSTRAINT chk_peso CHECK (peso BETWEEN 1 AND 10),
    CONSTRAINT fk_pergunta_dimensao FOREIGN KEY (fk_dimensao) REFERENCES dimensao(id)
);

-- 1 pergunta : N opções. nivel_risco: 0 = menor risco, 2 = maior risco
-- Esse UNIQUE (id, fk_pergunta) é o truque pra garantir que a resposta escolhida pertence mesmo à pergunta certa
CREATE TABLE opcao_resposta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_pergunta INT NOT NULL,
    texto VARCHAR(60) NOT NULL,
    nivel_risco TINYINT NOT NULL,
    UNIQUE (id, fk_pergunta),      -- necessário para a chave composta de questionario_resposta
    CONSTRAINT chk_nivel_risco CHECK (nivel_risco BETWEEN 0 AND 2),
    CONSTRAINT fk_opcao_pergunta FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id)
);

-- ---------- FAIXAS DE RISCO (status, texto e cor do veredito) ----------
-- Define o diagnóstico final de acordo com o percentual de cyberpsicose
CREATE TABLE faixa_risco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL UNIQUE,
    percentual_min INT NOT NULL,
    percentual_max INT NOT NULL,
    titulo VARCHAR(80) NOT NULL,
    texto VARCHAR(400) NOT NULL,
    cor VARCHAR(7) NOT NULL
);

-- ---------- AVALIAÇÕES (dados brutos do usuário) ----------
-- Cada preenchimento do questionário vira uma avaliação aqui
CREATE TABLE questionario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    data_resposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questionario_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

-- N questionários : N implantes (a ordem é o próprio id)
-- Guarda quais implantes o usuário selecionou naquela avaliação
CREATE TABLE questionario_implante (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_questionario INT NOT NULL,
    fk_implante INT NOT NULL,
    UNIQUE (fk_questionario, fk_implante),
    CONSTRAINT fk_qi_questionario FOREIGN KEY (fk_questionario) REFERENCES questionario(id),
    CONSTRAINT fk_qi_implante FOREIGN KEY (fk_implante) REFERENCES implante(id)
);

-- Uma resposta por pergunta em cada avaliação. A chave composta garante que a opção
-- escolhida pertence mesmo àquela pergunta.
CREATE TABLE questionario_resposta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_questionario INT NOT NULL,
    fk_pergunta INT NOT NULL,
    fk_opcao INT NOT NULL,
    UNIQUE (fk_questionario, fk_pergunta),
    CONSTRAINT fk_qr_questionario FOREIGN KEY (fk_questionario) REFERENCES questionario(id),
    CONSTRAINT fk_qr_opcao FOREIGN KEY (fk_opcao, fk_pergunta) REFERENCES opcao_resposta(id, fk_pergunta)
);

-- ---------- DADOS FIXOS ----------
-- Populando as categorias base do catálogo
INSERT INTO categoria_implante (nome) VALUES
('Sistema nervoso'),('Neural'),('Braços'),('Pele'),('Visão'),('Pernas'),('Esqueleto'),('Circulação'),('Mãos'),('Respiração');

-- Populando os implantes com custo de humanidade e descrição no clima do jogo
INSERT INTO implante (fk_categoria, nome, custo_humanidade, descricao) VALUES
(1,'Sandevistan',25,'Reage a um objeto que cai ou a um imprevisto no trânsito com reflexos acelerados.'),
(2,'Cyberdeck',18,'Interage com redes e sistemas autorizados no trabalho e resolve burocracia digital.'),
(3,'Lâminas Louva-a-Deus',15,'Corta materiais resistentes em trabalhos manuais; exigem cuidado perto de outras pessoas.'),
(3,'Monofio',14,'Corta materiais em reparos e reformas; seu fio é extremamente afiado.'),
(3,'Braços de Gorila',12,'Carrega compras pesadas, move móveis e faz trabalhos que exigem força física.'),
(4,'Armadura Subdérmica',10,'Dá proteção extra contra impactos em quedas, acidentes e trabalhos arriscados.'),
(5,'Óticas Kiroshi',6,'Dá zoom e amplia detalhes de uma peça ou pessoa; ajuda a enxergar no escuro.'),
(6,'Tendões Reforçados',8,'Dá mais agilidade em corridas e saltos; evita lesões em esforços repetitivos.'),
(7,'Esqueleto de Titânio',16,'Sustenta mais peso ao carregar ferramentas, bagagens ou materiais de trabalho.'),
(8,'Bomba de Sangue',9,'Ajuda na recuperação após ferimentos e reduz o impacto de um acidente na rotina.'),
(9,'Link Inteligente',7,'Ajuda a mirar com mais precisão em trabalhos de risco e na defesa pessoal.'),
(10,'Pulmões Biônicos',7,'Dá mais fôlego ao subir escadas, correr ou praticar atividades físicas.');

-- Benefícios disponíveis para os implantes
INSERT INTO beneficio (nome) VALUES
('Reflexos'),('Acesso digital'),('Corte'),('Força'),('Proteção'),('Visão'),('Agilidade'),('Capacidade de carga'),('Recuperação'),('Precisão'),('Fôlego');

-- (implante, benefício): alguns benefícios vêm de mais de um implante
INSERT INTO implante_beneficio (fk_implante, fk_beneficio) VALUES
(1,1),(1,7),(2,2),(3,3),(4,3),(5,4),(5,8),(6,5),(7,6),(8,7),(9,8),(9,5),(10,9),(11,10),(12,11);

-- Dimensões usadas pra medir o estilo de vida e saúde mental
INSERT INTO dimensao (nome) VALUES ('Emocional'),('Física'),('Social');

-- Perguntas do questionário (usa o peso padrão 5)
INSERT INTO pergunta (fk_dimensao, texto, explicacao) VALUES
(1,'Estabilidade emocional','Quem já oscila muito de humor tem menos margem: cada implante pesa mais no cérebro.'),
(1,'Estresse cotidiano','Estresse constante mantém o sistema nervoso em alerta e reduz a tolerância ao cromo.'),
(2,'Qualidade do sono','É dormindo que o cérebro se recupera. Sem sono, a sobrecarga dos implantes se acumula.'),
(1,'Histórico de traumas urbanos','Traumas repetidos deixam marcas. O corpo reage como se o perigo nunca acabasse.'),
(3,'Rede de apoio','Pessoas por perto trazem você de volta à realidade. O isolamento tira esse freio.'),
(2,'Uso de álcool ou estimulantes','Substâncias mascaram os sintomas e deixam a mente ainda mais instável.'),
(3,'Acompanhamento psicológico','Quem tem acompanhamento percebe os sinais cedo e age antes do surto.');

-- Alternativas de cada pergunta (0 = mais tranquilo, 2 = mais pesado)
INSERT INTO opcao_resposta (fk_pergunta, texto, nivel_risco) VALUES
(1,'Alta',0),(1,'Moderada',1),(1,'Baixa',2),
(2,'Baixo',0),(2,'Moderado',1),(2,'Alto',2),
(3,'Durmo bem (7h+)',0),(3,'Sono irregular',1),(3,'Durmo muito mal',2),
(4,'Nenhum',0),(4,'Pontual',1),(4,'Recorrente',2),
(5,'Rede presente',0),(5,'Apoio ocasional',1),(5,'Isolamento',2),
(6,'Nunca',0),(6,'Às vezes',1),(6,'Frequente',2),
(7,'Regular',0),(7,'Raro',1),(7,'Nunca',2);

-- Faixas do veredito final (do mais suave ao surto total)
INSERT INTO faixa_risco (nome, percentual_min, percentual_max, titulo, texto, cor) VALUES
('Estável',0,39,'Você ainda reconhece seu reflexo.','O cromo ainda funciona como ferramenta. Você enxerga Night City como ela é: perigosa, mas com pessoas dentro. Sente empatia, dorme sem barulho na cabeça e consegue parar quando quer.','#00e5ff'),
('Alerta',40,69,'Algo começou a falhar.','As pessoas parecem mais lentas e mais barulhentas. Pequenas irritações viram explosões. Você ainda se reconhece, mas já precisa se esforçar para sentir o que sentia antes.','#ffc400'),
('Limite Crítico',70,89,'A memória ainda é sua. A empatia, não.','Cada vantagem vem acompanhada de silêncio. O sucesso começa a parecer sobrevivência automática. Os outros viram obstáculos ou alvos, e a linha da culpa está próxima.','#ff7a00'),
('Cyberpsicose',90,100,'Você passou do limite.','Para você, o mundo virou ruído e ameaça. Rostos viram alvos, nomes deixam de significar algo e a violência parece a única resposta clara. A MaxTac já está a caminho.','#ff2a6d');

-- ---------- VIEWS ----------
-- Soma quantos implantes foram escolhidos e o custo total de humanidade por questionário
CREATE VIEW vw_carga AS
SELECT qi.fk_questionario, COUNT(*) AS qtd_implantes, SUM(i.custo_humanidade) AS carga_total
FROM questionario_implante qi JOIN implante i ON i.id = qi.fk_implante
GROUP BY qi.fk_questionario;

-- Começa em 100 de resistência e vai descontando (nivel_risco * peso) conforme as respostas
CREATE VIEW vw_resistencia AS
SELECT qr.fk_questionario, GREATEST(10, 100 - SUM(o.nivel_risco * p.peso)) AS resistencia_neural
FROM questionario_resposta qr
JOIN opcao_resposta o ON o.id = qr.fk_opcao
JOIN pergunta p ON p.id = o.fk_pergunta
GROUP BY qr.fk_questionario;

-- Cruza a carga dos implantes com a resistência neural pra achar o % de cyberpsicose (travado no máx. 100)
CREATE VIEW vw_saturacao AS
SELECT c.fk_questionario, c.qtd_implantes, c.carga_total, r.resistencia_neural,
       LEAST(100, ROUND((c.carga_total * 100) / r.resistencia_neural)) AS percentual_cyberpsicose
FROM vw_carga c JOIN vw_resistencia r ON r.fk_questionario = c.fk_questionario;

-- Junta tudo num pacote pronto pro front/dashboard: números, humanidade restante e veredito da faixa
-- o status, o texto e a cor vêm da tabela faixa_risco
CREATE VIEW vw_resultado AS
SELECT q.id AS id_questionario, u.id AS id_usuario, u.nome, q.data_resposta,
       s.qtd_implantes, s.carga_total, s.resistencia_neural, s.percentual_cyberpsicose,
       100 - s.percentual_cyberpsicose AS humanidade_restante,
       f.nome AS status_risco, f.titulo AS titulo_veredito, f.texto AS texto_veredito, f.cor
FROM questionario q
JOIN usuario u ON u.id = q.fk_usuario
JOIN vw_saturacao s ON s.fk_questionario = q.id
JOIN faixa_risco f ON s.percentual_cyberpsicose BETWEEN f.percentual_min AND f.percentual_max;

-- Mostra a evolução passo a passo (ordem de escolha e carga acumulando a cada implante)
CREATE VIEW vw_curva AS
SELECT qi.fk_questionario,
       ROW_NUMBER() OVER (PARTITION BY qi.fk_questionario ORDER BY qi.id) AS ordem,
       i.nome, c.nome AS categoria, i.descricao, i.custo_humanidade,
       SUM(i.custo_humanidade) OVER (PARTITION BY qi.fk_questionario ORDER BY qi.id) AS carga_acumulada
FROM questionario_implante qi
JOIN implante i ON i.id = qi.fk_implante
JOIN categoria_implante c ON c.id = i.fk_categoria;

-- Lista cada resposta dada com a explicação da pergunta pra montar o raio-x dos fatores
CREATE VIEW vw_fatores AS
SELECT qr.fk_questionario, d.nome AS dimensao, p.texto AS pergunta, o.texto AS resposta, o.nivel_risco, p.explicacao
FROM questionario_resposta qr
JOIN opcao_resposta o ON o.id = qr.fk_opcao
JOIN pergunta p ON p.id = o.fk_pergunta
JOIN dimensao d ON d.id = p.fk_dimensao;

-- benefícios DISTINTOS conquistados (e de quantos implantes vêm)
CREATE VIEW vw_beneficios AS
SELECT qi.fk_questionario, b.nome AS beneficio, COUNT(*) AS implantes_que_dao
FROM questionario_implante qi
JOIN implante_beneficio ib ON ib.fk_implante = qi.fk_implante
JOIN beneficio b ON b.id = ib.fk_beneficio
GROUP BY qi.fk_questionario, b.id, b.nome;

-- risco médio de cada dimensão (0 a 100)
-- Como nivel_risco vai de 0 a 2, multiplicar a média por 50 joga a escala de 0 a 100
CREATE VIEW vw_risco_dimensao AS
SELECT qr.fk_questionario, d.nome AS dimensao, ROUND(AVG(o.nivel_risco) * 50) AS risco_percentual
FROM questionario_resposta qr
JOIN opcao_resposta o ON o.id = qr.fk_opcao
JOIN pergunta p ON p.id = o.fk_pergunta
JOIN dimensao d ON d.id = p.fk_dimensao
GROUP BY qr.fk_questionario, d.id, d.nome;

-- ---------- ACESSO PELA VM ----------
-- Cria o usuário da aplicação e dá permissão básica de dados (sem mexer em estrutura do banco)
CREATE USER'cyberpsico_app'@'%' IDENTIFIED BY 'manivi_12';
GRANT SELECT, INSERT, UPDATE, DELETE ON cyberpunk_db.* TO 'cyberpsico_app'@'%';
FLUSH PRIVILEGES;

-- ---------- CONSULTAS DE EXEMPLO ----------
-- Resultado geral da avaliação 1
SELECT * FROM vw_resultado WHERE id_questionario = 1;
-- Risco por dimensão da avaliação 1
SELECT dimensao, risco_percentual FROM vw_risco_dimensao WHERE fk_questionario = 1;
-- Benefícios conquistados na avaliação 1
SELECT beneficio, implantes_que_dao FROM vw_beneficios WHERE fk_questionario = 1;
-- categoria mais escolhida por todos os usuários
SELECT c.nome, COUNT(*) AS vezes FROM questionario_implante qi
JOIN implante i ON i.id = qi.fk_implante JOIN categoria_implante c ON c.id = i.fk_categoria
GROUP BY c.id, c.nome ORDER BY vezes DESC;
-- último acesso de cada usuário
-- LEFT JOIN aqui garante que quem nunca logou ainda apareça na lista (com NULL)
SELECT u.nome, MAX(a.data_hora) AS ultimo_acesso FROM usuario u LEFT JOIN acesso a ON a.fk_usuario = u.id GROUP BY u.id, u.nome;