const express = require("express");
const path = require("path");

const app = express();
const PORTA = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/clima", async (req, res) => {
  const cidade = req.query.cidade;

  if (!cidade) {
    return res.status(400).json({ erro: "Digite o nome de uma cidade." });
  }

  try {
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

    const previsao = diario.time.map((data, i) => ({
      data: data,
      maxima: Math.round(diario.temperature_2m_max[i]),
      minima: Math.round(diario.temperature_2m_min[i]),
      codigo: diario.weather_code[i],
    }));

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
