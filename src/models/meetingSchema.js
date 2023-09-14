const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    title: { type: String, required: true },
    organizes: { type: String, required: true },
    guests: { type: Array, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
})

module.exports = mongoose.model('Meetings', meetingSchema);