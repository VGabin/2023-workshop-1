const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Bonjour Monde!');
});

app.listen(PORT, () => {
  console.log(`Serveur fonctionnant sur http://localhost:${PORT}`);
});
