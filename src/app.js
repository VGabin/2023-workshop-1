require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { createMeeting } = require('./controllers/eventController');
const csvParse = require('./services/csvParser');
const app = express();
const port = 3000;

// Configuration de Multer pour gérer les fichiers téléversés
const storage = multer.memoryStorage(); // Stockez le fichier en mémoire plutôt que sur le disque

const upload = multer({ storage: storage });

// Serveur statique pour servir la page HTML
app.use(express.static('public'));

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

app.use(express.json());

app.post('/create-meeting', createMeeting);
