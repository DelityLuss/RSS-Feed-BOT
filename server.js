// Path: index.js

// Server for rss feed ical calendar
const express = require('express');
const app = express();
const fs = require('fs');
const getCalendar = require("./src/getCalendar");
const remove_old_event = require("./src/updateCalendar");
const chalk = require('chalk');

// RSS file path
const RSS_FILE_PATH = "RSS/";
const PORT = process.env.PORT || 3000;
const TRACK_CLIENT = true;

// Ressources
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


function trackClient(req, page) {
    // track client
    var ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
    try {
        ip = ip.split(":")[3];
    }
    catch (error) {
        console.log(error);
    }
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var day = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    var user_agent = req.headers['user-agent'] || req.headers['User-Agent'];
    var contry = req.headers['cf-ipcountry'] || req.headers['x-forwarded-for'];
    var referer = req.headers['referer'] || req.headers['Referer'];
    var browser = user_agent.split(" ")[0];
    var os = user_agent.split(" ")[1];

    // add to json file
    var json = {
        "ip": ip,
        "time": time,
        "day": day,
        "user_agent": user_agent,
        "contry": contry,
        "referer": referer,
        "browser": browser,
        "os": os,
        "page": page
    };
    // write to json file
    fs.readFile('logs/user.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            // push new data to json file in user array
            obj = JSON.parse(data);
            obj.user.push(json);
            json = JSON.stringify(obj);
            fs.writeFile('logs/user.json', json, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                }
            }
            );
        }
    }
    );
    return json;
}

function logDate() {
    const date = new Date();
    const log = chalk.cyan(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    return log;
}



// Get the home page
app.get('/', (req, res) => {
    let info = TRACK_CLIENT ? trackClient(req, "refresh") : null;
    // display the home page with the info
    res.send('Hello World! <br> <br> <br> <br> <p>Information :</p>' + JSON.stringify(info));
    res.status(200);
}
);

// refresh the calendar
app.get('/refresh', async (req, res) => {
    TRACK_CLIENT ? trackClient(req, "refresh") : null;
    ressource = req.query.ressource;

    const log = logDate()

    if (ressource == undefined || ressource == "" && !(ressource in RESSOURCE)) {
        return res.send("Error: ressource not found");
    }

    firstDay = "2023-09-04"
    lastDay = "2024-06-30"

    console.info(`[${chalk.green("INFO")}][${log}][+] Refreshing calendar from ` + firstDay + " to " + lastDay);

    await getCalendar(ressource, firstDay, lastDay);

    res.send('Calendar refreshed! for ' + ressource + ' from ' + firstDay + ' to ' + lastDay);
    res.status(200);
}
);

app.get('/rss', async (req, res) => {
    let info = TRACK_CLIENT ? trackClient(req, "refresh") : null;
    const log = logDate()

    console.info(`[${chalk.green("INFO")}][${log}][+] Creating RSS feed for ${req.query.ressource} | IP : ${chalk.yellow(info.ip)}`);

    ressource = req.query.ressource;
    ressource = ressource.toUpperCase();

    if (ressource == undefined || ressource == "" && !(ressource in RESSOURCE)) {
        return res.send("Error: ressource not found");

    }

    res.download(`${RSS_FILE_PATH}${ressource}.ics`);

    console.info(`[${chalk.magenta(" UP ")}][${log}][+] RSS feed downloaded for ${req.query.ressource}`);

    res.status(200);
}
);

app.get('/update', async (req, res) => {
    TRACK_CLIENT ? trackClient(req, "update") : null;
    const log = logDate()

    console.info(`[${chalk.green("INFO")}][${log}][+] Updating calendar`);

    remove_old_event();

    res.send('Calendar updated!');
    res.status(200);
}
);


// Start the server
app.listen(PORT, () => {
    const log = logDate()
    console.log(`[${chalk.green("READY")}][${log}] Server started on port ` + PORT + '!');
}
);



// All rights reserved to @DelityLuss =) 
