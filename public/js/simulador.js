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