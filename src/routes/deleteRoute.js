const express = require('express');
const router = express.Router();
const Meeting = require('../models/meetingSchema');

// Importez vos dépendances et configurations nécessaires

// Gestionnaire de route pour la suppression
router.post('/', async (req, res) => {
    try {
        // Spécifiez un filtre pour la suppression (par exemple, toutes les réunions qui ont un certain critère)
        await Meeting.deleteMany();

        // Redirigez l'utilisateur vers la page d'accueil après la suppression
        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la suppression des réunions :', error);
        res.status(500).send('Erreur lors de la suppression des réunions.');
    }
});

module.exports = router;
