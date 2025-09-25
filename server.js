const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy para API StarHub
app.use('/api', (req, res) => {
  const fetch = require('node-fetch');
  const apiUrl = `https://api.starhubsolutions.com/v1${req.path}${req.url.includes('?') ? '&' : '?'}${new URLSearchParams(req.query).toString()}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-starhub-token': process.env.STARHUB_TOKEN || ''
  };

  fetch(apiUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(error => res.status(500).json({ error: error.message }));
});

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
