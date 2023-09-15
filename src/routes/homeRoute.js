const express = require('express');
const router = express.Router();
const Meeting = require('../models/meetingSchema');

// Route pour la page d'accueil
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.render('index', { meetings });
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis la base de données :', error);
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});

// Autres routes spécifiques aux réunions...

module.exports = router;
