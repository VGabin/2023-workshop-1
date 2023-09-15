const express = require('express');
const router = express.Router();
const Meeting = require('../models/meetingSchema');
const path = require('path');

// Importez vos dépendances et configurations nécessaires

// Gestionnaire de route pour le téléchargement
router.get('/', async (req, res) => {
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
                { id: 'title', title: 'Nom de la reunion' },
                { id: 'organizes', title: "Mail de l'organisateur" },
                { id: 'guests', title: 'Mail des participants' },
                { id: 'start_date', title: 'Date/heure de commencement' },
                { id: 'end_date', title: 'Date/heure de fin' },
                { id: 'link', title: 'Lien' },
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

module.exports = router;
