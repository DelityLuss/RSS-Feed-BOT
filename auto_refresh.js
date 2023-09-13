// Path : auto_refresh.js

var CronJob = require('cron').CronJob;

const getCalendar = require("./src/getCalendar");

firstDay = "2023-09-04"
lastDay = "2024-06-30"

var job = new CronJob('0 30 17 * * *', async function () { //effectue l'update tous les jours à 17h30 et 0 secondes
    console.info("[+] Auto-Refreshing calendar from " + firstDay + " to " + lastDay);
    await getCalendar("ALL", firstDay, lastDay);
    }
    , null, true, 'Europe/Paris');

job.start();



