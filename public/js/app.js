// app.js
// Este código roda no navegador. Ele pega a cidade digitada, pede o clima
// pro nosso back-end (/clima) e mostra o resultado na tela.

// "Dicionário" que transforma o código do tempo (weather_code) em
// um texto + emoji. A API Open-Meteo usa esses códigos padrão (WMO).
const CODIGOS = {
  0: ["Céu limpo", "☀️"],
  1: ["Predominantemente limpo", "🌤️"],
  2: ["Parcialmente nublado", "⛅"],
  3: ["Nublado", "☁️"],
  45: ["Névoa", "🌫️"],
  48: ["Névoa com geada", "🌫️"],
  51: ["Garoa fraca", "🌦️"],
  53: ["Garoa moderada", "🌦️"],
  55: ["Garoa forte", "🌧️"],
  61: ["Chuva fraca", "🌦️"],
  63: ["Chuva moderada", "🌧️"],
  65: ["Chuva forte", "🌧️"],
  71: ["Neve fraca", "🌨️"],
  73: ["Neve moderada", "🌨️"],
  75: ["Neve forte", "❄️"],
  80: ["Pancadas de chuva", "🌦️"],
  81: ["Pancadas fortes", "🌧️"],
  82: ["Pancadas muito fortes", "⛈️"],
  95: ["Trovoada", "⛈️"],
  96: ["Trovoada com granizo", "⛈️"],
  99: ["Trovoada forte com granizo", "⛈️"],
};

// Guarda os elementos da página em variáveis pra facilitar.
const form = document.getElementById("formBusca");
const campoCidade = document.getElementById("campoCidade");
const divErro = document.getElementById("erro");
const divResultado = document.getElementById("resultado");
const divPrevisao = document.getElementById("previsao");

// Transforma uma data "2026-10-16" no nome curto do dia (ex: "qui").
function nomeDoDia(dataTexto) {
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  // O "T00:00" evita problemas de fuso ao criar a data.
  const d = new Date(dataTexto + "T00:00");
  return dias[d.getDay()];
}

// Quando o formulário é enviado...
form.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // evita recarregar a página

  const cidade = campoCidade.value.trim();
  if (!cidade) return;

  // Esconde resultado e erro antigos.
  divResultado.classList.add("d-none");
  divErro.classList.add("d-none");

  try {
    // Chama o nosso back-end.
    const resposta = await fetch("/clima?cidade=" + encodeURIComponent(cidade));
    const dados = await resposta.json();

    // Se deu erro (cidade não achada, etc.), mostra a mensagem.
    if (!resposta.ok) {
      divErro.textContent = dados.erro || "Algo deu errado.";
      divErro.classList.remove("d-none");
      return;
    }

    // Descobre o texto e o emoji a partir do código do tempo.
    const info = CODIGOS[dados.codigo] || ["Clima", "🌡️"];

    // Preenche a tela com os dados.
    document.getElementById("nomeCidade").textContent =
      dados.cidade + ", " + dados.pais;
    document.getElementById("icone").textContent = info[1];
    document.getElementById("condicao").textContent = info[0];
    document.getElementById("temperatura").textContent = dados.temperatura + "°C";
    document.getElementById("umidade").textContent = dados.umidade + "%";
    document.getElementById("vento").textContent = dados.vento + " km/h";

    // Monta a lista dos próximos 7 dias.
    divPrevisao.innerHTML = "";
    dados.previsao.forEach((dia, i) => {
      const infoDia = CODIGOS[dia.codigo] || ["Clima", "🌡️"];
      // O primeiro item é hoje; mostramos "Hoje" em vez do nome do dia.
      const rotulo = i === 0 ? "Hoje" : nomeDoDia(dia.data);

      const linha = document.createElement("div");
      linha.className =
        "d-flex align-items-center justify-content-between py-1";
      linha.innerHTML =
        '<span class="dia-nome">' + rotulo + "</span>" +
        '<span class="dia-icone">' + infoDia[1] + "</span>" +
        '<span class="dia-temp">' +
        "<strong>" + dia.maxima + "°</strong> " +
        '<span class="text-muted">' + dia.minima + "°</span>" +
        "</span>";
      divPrevisao.appendChild(linha);
    });

    divResultado.classList.remove("d-none");
  } catch (e) {
    divErro.textContent = "Não foi possível conectar. Tente de novo.";
    divErro.classList.remove("d-none");
  }
});
