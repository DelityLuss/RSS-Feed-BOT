// Path : auto_refresh.js

var CronJob = require('cron').CronJob;

const getCalendar = require("./src/getCalendar");

firstDay = "2023-09-04"
lastDay = "2024-06-30"

var job = new CronJob('0 30 17 * * *', async function () { //effectue l'update tous les jours à 17h30 et 0 secondes
    console.info("[+] Auto-Refreshing calendar from " + firstDay + " to " + lastDay);
    await getCalendar("B1G1", firstDay, lastDay);
    await getCalendar("B1G2", firstDay, lastDay);
    await getCalendar("B1G3", firstDay, lastDay);
    await getCalendar("B1G4", firstDay, lastDay);
    await getCalendar("B2G1", firstDay, lastDay);
    await getCalendar("B2G2", firstDay, lastDay);
    await getCalendar("B2GA", firstDay, lastDay);
    }
    , null, true, 'Europe/Paris');

job.start();



