const fetch = require("node-fetch");
const fs = require('fs');
const remove_old_event = require("./updateCalendar");
const chalk = require('chalk');

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
    const log = chalk.cyan(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());


    // get the ressource
    URL = getRessource(ressource);

    if (URL == false) {
        console.error(`[${chalk.red("ERROR")}][${log}][-] Error: ressource not found`);
        return null;
    }

    if (URL == true) {
        console.info(`[${chalk.green("INFO")}][${log}][+] Downloading calendar for all ressources`);
        for (var key in RESSOURCE) {
            if (key != "all") {
                try {

                    URL = getRessource(key);
                    console.info(`[${chalk.magenta(" UP ")}][${log}][+] Downloading calendar for ${key}`);
                    const response_all = await fetch(URL + "&firstDate=" + firstDate + "&lastDate=" + lastDate);
                    const data_all = await response_all.text();

                    // save the calendar in a file
                    fs.writeFile("RSS/temp/" + key + ".ics", data_all, function (err) {
                        if (err) throw err;
                        console.log(`[${chalk.green(" OK ")}][${log}][+] Calendar saved!`);

                        // remove old events
                        remove_old_event("RSS/temp/" + key + ".ics", "RSS/" + key + ".ics");
                        console.log(`[${chalk.green(" OK ")}][${log}][+] Calendar updated!`);
                    }
                    );


                }
                catch (error) {
                    console.error(`[${chalk.red("ERROR")}][${log}][-] Error: ${error}`);
                    return null;
                }

            }
        }
        return null;
    }

    try {

        console.info(`[${chalk.magenta(" UP ")}][${log}][+] Downloading calendar for ${key}`);
    const response = await fetch(URL + "&firstDate=" + firstDate + "&lastDate=" + lastDate);
    const data = await response.text();

    // save the calendar in a file
    fs.writeFile("RSS/temp/" + ressource + ".ics", data, function (err) {
        if (err) throw err;
        console.log(`[${chalk.green(" OK ")}][${log}][+] Calendar saved!`);

        // remove old events
        remove_old_event("RSS/temp/" + ressource + ".ics", "RSS/" + ressource + ".ics");
        console.log(`[${chalk.green(" OK ")}][${log}][+] Calendar updated!`);
    }
    );

    return null;

    }
    catch (error) {
        console.error(`[${chalk.red("ERROR")}][${log}][-] Error: ${error}`);
        return null;
    }


}

module.exports = getCalendar;