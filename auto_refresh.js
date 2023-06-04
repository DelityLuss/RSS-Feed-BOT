// Path : auto_refresh.js
const getCalendar = require("./src/getCalendar");

// refresh the calendar
async function refreshCalendar() {
        
        date = new Date();
    
        firstDay = "2022-09-05"
        lastDay = "2023-06-16"
    
        console.log("refreshing calendar from " + firstDay + " to " + lastDay);
    
        await getCalendar(firstDay, lastDay);
    

        console.log('Calendar refreshed! from ' + firstDay + ' to ' + lastDay);
    
    }

setInterval(refreshCalendar, 1000 * 60 * 60 * 24); // refresh every day



