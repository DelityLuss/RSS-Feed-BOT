const fetch = require("node-fetch");
const fs = require('fs');

BASE_URL = "https://ade-uga-ro-vs.grenet.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=49465&projectId=5&calType=ical"

RESSOURCE = {
    "B1G1": 49465,
    "B1G2": 49466,
    "B1G3": 49631,
    "B1G4": 50295,
    "B2G1": 49470,
    "B2G2": 49515,
}


// Download the calendar from the ADE website ICS format
async function getCalendar(firstDate, lastDate) {

    const response = await fetch(BASE_URL + "&firstDate=" + firstDate + "&lastDate=" + lastDate);
    const data = await response.text();

    // save the calendar in a file
    fs.writeFile("RSS/calendar.ics", data, function (err) {
        if (err) throw err;
        console.log('Calendar saved!');
    }
    );

    return null;
    
}   

module.exports = getCalendar;