// server.js
// Back-end do app de clima.
// Ele recebe o nome de uma cidade, descobre a localização dela e busca
// o clima atual na API gratuita Open-Meteo (não precisa de chave/cadastro).

const express = require("express");
const path = require("path");

const app = express();
const PORTA = 3000;

// Deixa a pasta "public" acessível (é onde fica o site: HTML, CSS, JS).
app.use(express.static(path.join(__dirname, "public")));

// Rota que o site chama pra pegar o clima de uma cidade.
// Exemplo: GET /clima?cidade=Recife
app.get("/clima", async (req, res) => {
  const cidade = req.query.cidade;

  if (!cidade) {
    return res.status(400).json({ erro: "Digite o nome de uma cidade." });
  }

  try {
    // 1) Descobre a latitude/longitude da cidade (geocoding).
    const urlGeo =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(cidade) +
      "&count=1&language=pt&format=json";

    const respGeo = await fetch(urlGeo);
    const dadosGeo = await respGeo.json();

    if (!dadosGeo.results || dadosGeo.results.length === 0) {
      return res.status(404).json({ erro: "Cidade não encontrada." });
    }

    const local = dadosGeo.results[0];

    // 2) Com a localização, busca o clima atual.
    // Pedimos o clima de AGORA (current) e a previsão dos próximos 7 dias (daily).
    const urlClima =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      local.latitude +
      "&longitude=" +
      local.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=auto&forecast_days=7";

    const respClima = await fetch(urlClima);
    const dadosClima = await respClima.json();
    const atual = dadosClima.current;
    const diario = dadosClima.daily;

    // Monta a lista dos 7 dias num formato fácil de usar no site.
    const previsao = diario.time.map((data, i) => ({
      data: data, // no formato "2026-10-16"
      maxima: Math.round(diario.temperature_2m_max[i]),
      minima: Math.round(diario.temperature_2m_min[i]),
      codigo: diario.weather_code[i],
    }));

    // 3) Monta a resposta e devolve pro site.
    res.json({
      cidade: local.name,
      pais: local.country,
      temperatura: Math.round(atual.temperature_2m),
      umidade: atual.relative_humidity_2m,
      vento: atual.wind_speed_10m,
      codigo: atual.weather_code,
      previsao: previsao,
    });
  } catch (e) {
    res.status(500).json({ erro: "Não foi possível buscar o clima agora." });
  }
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando! Abra no navegador: http://localhost:${PORTA}`);
});
