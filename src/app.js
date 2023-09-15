require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const homeRoute = require('./routes/homeRoute');
const uploadRoute = require('./routes/uploadRoute');
const downloadRoute = require('./routes/downloadRoute');
const deleteRoute = require('./routes/deleteRoute');

// Serveur statique pour servir la page HTML
app.use(express.static('public'));

mongoose.connect('mongodb://mongo:27017/docker-db', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');

app.use('/', homeRoute);
app.use('/upload', uploadRoute);
app.use('/download', downloadRoute);
app.use('/delete', deleteRoute);

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

