function parse(csv) { 
    const mongoose = require('mongoose');
    const Meeting = require('../models/meetingSchema.js');
    const fs = require('fs');

    // Connexion à la base de données MongoDB (remplacez l'URL par votre propre URL)
    mongoose.connect('mongodb://mongo:27017/docker-db', { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données:'));
    db.once('open', () => {
        console.log('Connecté à la base de données MongoDB');
    });

    // csv = fs.readFileSync("./services/data.csv");

    csv = csv.toString().replace(/\r/g, '');
    const array = csv.toString().split("\n");

    let results = [];

    let headers = array[0].split(";")

    array.pop([""])

    for (let row = 1; row < array.length; row++) {
        const meetingData = array[row].split(";");

        if (meetingData[2] && meetingData[2].includes("|")) {
            meetingData[2]= meetingData[2].split("|");
        }
        else {
            meetingData[2]= [meetingData[2]];
        }

        console.log("=========================================");
        console.log(meetingData);
        console.log("=========================================");

        // Construire un objet de recherche basé sur les propriétés que vous voulez vérifier
        const searchCriteria = {
            'title': meetingData[0],
            'organizes': meetingData[1],
            'guests': meetingData[2],
            'start_date': meetingData[3],
            'end_date': meetingData[4],
        };
    
        // Utilisez la méthode findOne() qui renvoie une promesse
        Meeting.findOne(searchCriteria)
            .then(existingMeeting => {
                if (existingMeeting) {
                    console.log('La réunion existe déjà dans la base de données, ne l\'ajoutez pas à nouveau :', existingMeeting);
                } else {
                    // L'objet n'existe pas, vous pouvez l'ajouter à la base de données
                    let meetingObject = new Meeting({
                        'title': meetingData[0],
                        'organizes': meetingData[1],
                        'guests': meetingData[2],
                        'start_date': meetingData[3],
                        'end_date': meetingData[4],
                    });
    
                    // Sauvegarder l'objet de réunion dans la base de données
                    return meetingObject.save().then(() => {
                        console.log('Réunion insérée avec succès dans la base de données');
                    })
                    .catch(err => {
                        console.error('Erreur lors de la recherche ou de l\'insertion dans la base de données :', err);
                    });
                }
            })
    }
    

    return array;
    
}


module.exports = {parse};