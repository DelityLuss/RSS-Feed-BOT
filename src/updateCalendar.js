const ical = require('ical.js');
const fs = require('fs');


function readICS(ics) {
  const file = fs.readFileSync(ics, 'utf8');
  const jcalData = ical.parse(file);
  const comp = new ical.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");
  return vevents;
}

function processICS(new_ics, old_ics, key){
  new_ics = readICS(new_ics);
  
  const newCalendar = new ical.Component(['vcalendar', [], []]);

  // add all events to the new calendar
  for (const event of new_ics) {
    newCalendar.addSubcomponent(event);
  }

  // add title and description
  newCalendar.updatePropertyWithValue("X-WR-CALNAME", "Emploi du temps - " + key);
  newCalendar.updatePropertyWithValue("CALSCALE", "GREGORIAN");
  

  // save the new calendar
  fs.writeFileSync(old_ics, newCalendar.toString());

  return;

}

module.exports = processICS;