function parse() { 
    const meetingSchema = require('./models/meetingSchema.js');
    const fs = require('fs');

    csv = fs.readFileSync("./services/data.csv");

    const array = csv.toString().split("\r");

    let results = [];

    let headers = array[0].split(";")

    for (let row = 1; row < array.length; row++) {
        const meetings = array[row];

        meetings.forEach(meeting => {
            let meetingObject = {
                'title': meeting[0],
                'organizes': meeting[1],
                'guests': meeting[2],
                'start_date': meeting[3],
                'end_date': meeting[4],
            }

        });
        
    }

    return headers;
    
}


module.exports = {parse};