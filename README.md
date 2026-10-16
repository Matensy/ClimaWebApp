# 🌤️ Clima Web App

App de **previsão do tempo**: você digita uma cidade e ele mostra a
temperatura, a umidade, o vento e a condição do céu naquele momento,
além da **previsão para os próximos 7 dias** (máxima e mínima de cada dia).

## 🛠️ Tecnologias usadas

- **Front-end:** HTML + [Bootstrap 5](https://getbootstrap.com/) + JavaScript
- **Back-end:** [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- **API de clima:** [Open-Meteo](https://open-meteo.com/) — gratuita e **sem
  precisar de chave/cadastro**

## 📁 Estrutura dos arquivos

```
ClimaWebApp/
├─ server.js          → o back-end (busca o clima na API)
├─ package.json       → dependências do projeto
└─ public/            → o site em si
   ├─ index.html      → a página
   ├─ css/style.css   → o estilo
   └─ js/app.js       → busca o clima e mostra na tela
```

## ▶️ Como rodar o projeto

> Antes de começar, você precisa ter o [Node.js](https://nodejs.org/) instalado
> (versão 18 ou mais nova).

1. Abra o terminal dentro da pasta do projeto.

2. Instale as dependências (só precisa fazer uma vez):

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. Abra o navegador em:

   ```
   http://localhost:3000
   ```

## 🧭 Como funciona (passo a passo)

1. Você digita uma cidade e clica em **Buscar**.
2. O site envia o nome da cidade pro back-end (rota `/clima`).
3. O back-end usa a Open-Meteo pra descobrir a localização da cidade
   e, em seguida, o clima atual.
4. Os dados voltam pro site, que mostra temperatura, umidade, vento
   e um emoji representando o tempo.

## 💡 Observações para quem está aprendendo

- O código tem **comentários em português** explicando cada parte.
- A busca do clima passa pelo back-end (e não direto do navegador),
  que é uma forma mais organizada e segura de trabalhar com APIs.
- A pasta `node_modules` **não** vai para o GitHub (veja o `.gitignore`).

---

Feito para estudo. Sinta-se à vontade para mexer e melhorar! 🚀
