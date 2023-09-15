async function createMeeting(params) {
    const axios = require('axios');
    const { createEvent } = require('../models/eventModel');
    
    
    const token = process.env.GRAPH_API_TOKEN;
    
    let attendees = []
    if (params && params.guests && Array.isArray(params.guests)) {
        params.guests.forEach(element => {
            attendees.push({
                'email': element,
                'name': element.split("@")[0],
            });
        });
    }
    const event = createEvent(params.title, "Vous êtes invités à une réunion", params.start_date, params.end_date, "My-Digital-School", attendees);

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

    return json(response.data);
}

module.exports = {createMeeting};