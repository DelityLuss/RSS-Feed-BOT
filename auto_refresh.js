// Path : auto_refresh.js

var CronJob = require('cron').CronJob;

const getCalendar = require("./src/getCalendar");

firstDay = "2022-09-05"
lastDay = "2023-06-16"

var job = new CronJob('0 0 * * * *', async function () {
    console.info("[+] Auto-Refreshing calendar from " + firstDay + " to " + lastDay);
    await getCalendar("all", firstDay, lastDay);
    }
    , null, true, 'Europe/Paris');

job.start();



