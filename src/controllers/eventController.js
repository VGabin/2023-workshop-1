const axios = require('axios');
const EventModel = require('../models/meetingSchema');

async function createMeeting(req, res, body) {
    try {
        const token = process.env.GRAPH_API_TOKEN;
        const inputData = body || req.body;
        const { title, organizes, guests, start_date, end_date } = inputData;

        if (!title || !organizes || !guests || !start_date || !end_date) {
            return res.status(400).send('Paramètres manquants');
        }

         const Guests = guests.map(guest => ({
        emailAddress: {
            address: guest.email
        }
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
            isOnlineMeeting: true, 
            onlineMeetingProvider: "teamsForBusiness",  
            attendees: Guests, 
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
       const simplifiedGuests = guests.map(guest => guest.email);



        const newEvent = new EventModel({ title, organizes, start_date, end_date, guests: simplifiedGuests, link: response.data.webLink });
        await newEvent.save();
        
        if(res) {
            res.json(response.data);
        } else {
            return response.data;
        }
    } catch (error) {
        console.error('Erreur:', error.response ? error.response.data : error.message);
        if(res) {
            res.status(500).send(error.response ? error.response.data : error.message);
        } else {
            throw error;
        }
    }
}

module.exports = { createMeeting };
