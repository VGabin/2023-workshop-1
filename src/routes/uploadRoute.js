const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParse = require('../services/csvParser');

// Configuration de Multer pour gérer les fichiers téléversés
const storage = multer.memoryStorage(); // Stockez le fichier en mémoire plutôt que sur le disque

const upload = multer({ storage: storage });

// Importez vos dépendances et configurations nécessaires

// Gestionnaire de route pour l'envoi de fichiers
router.post('/', upload.single('csvFile'), (req, res) => {
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

    // Une fois l'upload terminé, redirigez vers la page d'accueil
    res.redirect('/');
});

module.exports = router;
