const axios = require('axios');
const { createEvent } = require('../models/eventModel');

module.exports.createMeeting = async (req, res) => {
    try {
        const token = process.env.GRAPH_API_TOKEN;
        const { subject, body, start, end, location, attendees } = req.body;

        if (!subject || !body || !start || !end || !location || !attendees) {
            return res.status(400).send('Paramètres manquants');
        }

        const event = createEvent(subject, body, start, end, location, attendees);

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

        res.json(response.data);

    } catch (error) {
        res.status(500).send(error.message);
    }
};
