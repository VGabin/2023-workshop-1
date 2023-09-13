require('dotenv').config();
const csvParse = require('./services/csvParser.js');
const express = require('express');
const { createMeeting } = require('./controllers/eventController');
const app = express();

app.use(express.json());

app.post('/create-meeting', createMeeting);


console.log(process.env.GRAPH_API_TOKEN); 
console.log(csvParse.parse());

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});