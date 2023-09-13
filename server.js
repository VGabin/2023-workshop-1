require('dotenv').config();
const express = require('express');
const { createMeeting } = require('./controllers/eventController');
const app = express();

app.use(express.json());

app.post('/create-meeting', createMeeting);

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});
