module.exports.createEvent = (subject, body, start, end, location, attendees) => {
    return {
        subject,
        body,
        start,
        end,
        location,
        attendees
    };
};
