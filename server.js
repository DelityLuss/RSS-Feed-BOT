// Path: index.js

// Server for rss feed ical calendar
const express = require('express');
const app = express();
const fs = require('fs');
const getCalendar = require("./src/getCalendar");

// RSS file path
const RSS_FILE_PATH = "RSS/";

// Ressources
RESSOURCE = {
    "B1G1": 49465,
    "B1G2": 49466,
    "B1G3": 49631,
    "B1G4": 50295,
    "B2G1": 49470,
    "B2G2": 49515,
    "all": "all"
}


function trackClient(req, page) {
    // track client
    var ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
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
}

// Get the home page
app.get('/', (req, res) => {
    trackClient(req, "home");
    res.send('Hello World!');
}
);

// refresh the calendar
app.get('/refresh', async (req, res) => {
    trackClient(req, "refresh");
    ressource = req.query.ressource;

    if (ressource == undefined) {
        return res.send("Error: ressource not found");
    }

    if (!(ressource in RESSOURCE)) {
        return res.send("Error: ressource not found");
    }

    date = new Date();

    firstDay = "2022-09-05"
    lastDay = "2023-06-16"

    console.info("[+] Refreshing calendar from " + firstDay + " to " + lastDay);

    await getCalendar(ressource, firstDay, lastDay);

    res.send('Calendar refreshed! for ' + ressource + ' from ' + firstDay + ' to ' + lastDay);
}
);


// Create RSS Feed from calendar
app.get('/rss', async (req, res) => {
    trackClient(req, "rss");

    console.info("[+] Creating RSS feed");

    ressource = req.query.ressource;

    if (ressource == undefined) {
        return res.send("Error: ressource not found");
    }

    if (!(ressource in RESSOURCE)) {
        return res.send("Error: ressource not found");
    }
    
    res.download(`${RSS_FILE_PATH}${ressource}.ics`);

    console.info("[+] RSS feed downloaded");
}
);


// Start the server
app.listen(3000, () => {
    console.info('Server started on port 3000');
}
);