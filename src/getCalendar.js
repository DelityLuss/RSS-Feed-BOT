const fetch = require("node-fetch");
const fs = require('fs');

BASE_URL = "https://ade-uga-ro-vs.grenet.fr/jsp/custom/modules/plannings/anonymous_cal.jsp"

RESSOURCE = {
    "B1G1": 49465,
    "B1G2": 49466,
    "B1G3": 49631,
    "B1G4": 50295,
    "B2G1": 49470,
    "B2G2": 49515,
    "B2GA": 49262,
    "all": "all"
}


function getRessource(ressource) {
    if (ressource in RESSOURCE) {
        ressource = RESSOURCE[ressource];

        if (ressource == "all") {
            return true;
        }
        URL = BASE_URL + "?resources=" + ressource + "&projectId=5&calType=ical"

        return URL;
    }
    else {
        return false;
    }
}


// Download the calendar from the ADE website ICS format
async function getCalendar(ressource, firstDate, lastDate) {

    const date = new Date();
    const log = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();


    // get the ressource
    URL = getRessource(ressource);

    if (URL == false) {
        console.error(`[${log}][-] Error: ressource not found`);
        return null;
    }

    if (URL == true) {
        console.info(`[${log}][+] Downloading calendar for all ressources`);
        for (var key in RESSOURCE) {
            if (key != "all") {
                URL = getRessource(key);
                console.info(`[${log}][+] Downloading calendar for ${key}`);
                const response_all = await fetch(URL + "&firstDate=" + firstDate + "&lastDate=" + lastDate);
                const data_all = await response_all.text();

                // save the calendar in a file
                fs.writeFile("RSS/" + key + ".ics", data_all, function (err) {
                    if (err) throw err;
                    console.log(`[${log}][+] Calendar saved!`);
                }
                );
            }
        }
        return null;
    }

    console.info("["+ log + "][+] Downloading calendar from " + firstDate + " to " + lastDate);
    const response = await fetch(URL + "&firstDate=" + firstDate + "&lastDate=" + lastDate);
    const data = await response.text();

    // save the calendar in a file
    fs.writeFile("RSS/"+ ressource +".ics", data, function (err) {
        if (err) throw err;
        console.log(`[${log}][+] Calendar saved!`);
    }
    );

    return null;

}

module.exports = getCalendar;