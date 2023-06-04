// Path: index.js

// Server for rss feed ical calendar
const express = require('express');
const app = express();

const getCalendar = require("./src/getCalendar");

// RSS file path
const RSS_FILE_PATH = "RSS/calendar.ics";

// Get the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

// refresh the calendar
app.get('/refresh', async (req, res) => {
    
    date = new Date();

    firstDay = "2022-09-05"
    lastDay = "2023-06-16"

    console.log("refreshing calendar from " + firstDay + " to " + lastDay);

    await getCalendar(firstDay, lastDay);

    res.send('Calendar refreshed! from ' + firstDay + ' to ' + lastDay);
}
);


// Create RSS Feed from calendar
app.get('/rss', async (req, res) => {
    res.download(RSS_FILE_PATH);
    console.log("RSS feed downloaded");
}
);


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
}
);