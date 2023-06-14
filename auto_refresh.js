// Path : auto_refresh.js

var CronJob = require('cron').CronJob;

const getCalendar = require("./src/getCalendar");

var job = new CronJob('0 0 * * * *', async function () {
    console.info("[+] Auto-Refreshing calendar from " + firstDay + " to " + lastDay);
    await getCalendar("all", firstDay, lastDay);
    }
    , null, true, 'Europe/Paris');

job.start();



