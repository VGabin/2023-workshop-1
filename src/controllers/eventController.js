const axios = require('axios');
const EventModel = require('../models/meetingSchema');


module.exports.createMeeting = async (req, res) => {
    try {
        const token = process.env.GRAPH_API_TOKEN;
        const { title, organizes, guests, start_date, end_date } = req.body;

        if (!title || !organizes || !guests || !start_date || !end_date) {
            return res.status(400).send('Paramètres manquants');
        }

        const newEvent = new EventModel({ title, organizes, guests, start_date, end_date });
        await newEvent.save();

        const Guests = guests.map(guest => ({
            emailAddress: {
                address: guest.email,  
                name: guest.name || ''  
            },
            type: "required"
        }));

        const event = {
            subject: title,
            body: {
                contentType: "HTML",
                content: "",  
            },
            start: {
                dateTime: start_date,
                timeZone: "UTC"  
            },
            end: {
                dateTime: end_date,
                timeZone: "UTC"  
            },
            location: {
                displayName: "",  
            },
        
        };

        const response = await axios.post(
            'https://graph.microsoft.com/v1.0/me/events',
            event, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        const teamsLink = response.data.joinWebUrl;


      res.json({
        data: response.data,
      teamsLink: teamsLink
});

    

        res.json(response.data);
    } catch (error) {
        console.error('Erreur:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
};

