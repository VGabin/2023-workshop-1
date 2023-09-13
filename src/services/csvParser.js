function parse() { 
    
    const fs = require('fs');

    csv = fs.readFileSync("./services/data.csv");

    const array = csv.toString().split("\r");

    let results = [];

    let headers = array[0].split(";")

    return headers;
    
}


module.exports = {parse};