require('dotenv').config();
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const { createMeeting } = require('./controllers/eventController');
const csvParse = require('./services/csvParser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Meeting = require('./models/meetingSchema');

// Configuration de Multer pour gérer les fichiers téléversés
const storage = multer.memoryStorage(); // Stockez le fichier en mémoire plutôt que sur le disque

const upload = multer({ storage: storage });

// Serveur statique pour servir la page HTML
app.use(express.static('public'));

mongoose.connect('mongodb://mongo:27017/docker-db', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find(); // Récupérer toutes les réunions depuis la base de données

        // Passer les données à votre modèle HTML
        res.render('index', { meetings });
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis la base de données :', error);
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});

app.get('/download', async (req, res) => {
    try {
        const meetings = await Meeting.find(); // Récupérer toutes les réunions depuis la base de données

        // Convertissez les données en format CSV (ex. avec la bibliothèque 'csv-parser')
        const csvData = meetings.map(meeting => {
            return {
                title: meeting.title,
                organizes: meeting.organizes,
                guests: meeting.guests,
                start_date: meeting.start_date,
                end_date: meeting.end_date,
                link: meeting.link
            };
        });

        // Générez un fichier CSV temporaire
        const csvFileName = 'meetings.csv'; // Nom du fichier CSV
        const csvFilePath = path.join(__dirname, csvFileName); // Chemin du fichier CSV

        // Utilisez la bibliothèque 'csv-writer' pour créer le fichier CSV
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'title', title: 'Title' },
                { id: 'organizes', title: 'Organizes' },
                { id: 'guests', title: 'Guests' },
                { id: 'start_date', title: 'Start Date' },
                { id: 'end_date', title: 'End Date' },
                { id: 'link', title: 'Link' },
            ],
            fieldDelimiter: ";"
        });

        // Écrivez les données dans le fichier CSV
        await csvWriter.writeRecords(csvData);

        // Définissez les en-têtes de la réponse pour déclencher le téléchargement
        res.setHeader('Content-Disposition', `attachment; filename="${csvFileName}"`);
        res.setHeader('Content-Type', 'text/csv');

        // Envoyez le fichier CSV en réponse
        res.sendFile(csvFilePath);

    } catch (error) {
        console.error('Erreur lors de la récupération et de la création du fichier CSV :', error);
        res.status(500).send('Erreur lors de la récupération des données ou de la création du fichier CSV.');
    }
});

// Gestionnaire de route pour l'envoi de fichiers
app.post('/upload', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléversé.');
    }

    const fileBuffer = req.file.buffer; // Le contenu du fichier téléversé

    // Vérifiez que le fichier est au format CSV (vérifiez son extension ou son contenu si nécessaire)
    if (!req.file.originalname.endsWith('.csv')) {
        return res.status(400).send('Le fichier doit être au format CSV.');
    }

    // Appelez votre méthode csvParse.parse() avec le contenu du fichier CSV
    const csvContent = fileBuffer.toString('utf-8');
    const headers = csvParse.parse(csvContent);

    // Faites quelque chose avec les résultats, par exemple, renvoyez les en tant que réponse
    res.send(`Entêtes CSV : ${headers}`);
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

