async function parse(csv) { 
    const Meeting = require('../models/meetingSchema.js');
    const { createMeeting } = require('../controllers/eventController');

    csv = csv.toString().replace(/\r/g, '');
    const array = csv.split("\n");

    
    console.log('Nombre total de lignes:', array.length); // Loggez le nombre total de lignes


    array.pop();

    for (let row = 1; row < array.length; row++) {
        const meetingData = array[row].split(";");

        if (meetingData[2] && meetingData[2].includes(",")) {
            meetingData[2] = meetingData[2].split(",").map(email => ({ email }));
        } else {
            meetingData[2] = [ { email: meetingData[2] } ];
        }

        const searchCriteria = {
            title: meetingData[0],
            organizes: meetingData[1],
            guests: meetingData[2],
            start_date: meetingData[3],
            end_date: meetingData[4],
        };

        try {
            const existingMeeting = await Meeting.findOne(searchCriteria);

            console.log('Recherche de critères :', JSON.stringify(searchCriteria), 'Résultat :', JSON.stringify(existingMeeting)); 
        
    
            if (existingMeeting) {
                console.log('La réunion existe déjà dans la base de données, ne l\'ajoutez pas à nouveau :', existingMeeting);
                continue; 
            } else {
                const linkData = await createMeeting(null, null, searchCriteria);
                searchCriteria.link = linkData.webLink; 
            
                console.log('Réunion créée avec succès :', searchCriteria);
            
            }
        } catch (err) {
            console.error('Erreur lors de la recherche ou de l\'insertion dans la base de données :', err);
        }
    }

    return array;
}

module.exports = { parse };
