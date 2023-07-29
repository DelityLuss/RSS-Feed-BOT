const ical = require('node-ical');
const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

function logDate() {
    const date = new Date();
    const log = chalk.cyan(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());

    return log;
}

function remove_old_event(new_ics, old_ics) {
    console.log(`[${chalk.green("INFO")}][${logDate()}][+] Removing old events from ${new_ics} to ${old_ics}`);

    const file_old = readline.createInterface({
        input: fs.createReadStream(old_ics),
        output: process.stdout,
        terminal: false
    });

    let line_old = "";
    let line_event = "";
    is_cancel = false;
    file_old.on('line', (l) => {
        if (l.includes("METHOD:CANCEL")) {
            line_old += "";
            is_cancel = true;
        }
        else if (is_cancel) {
            line_old += l + "\n";
        }
        else if (l.includes("END:VCALENDAR")) {
            // pass
        }
        else {
            line_event += l + "\n";
        }
    });

    console.log(line_event)

    file_old.on('close', () => {
        fs.writeFile(old_ics, line_event, function (err) {
            if (err) throw err;

            new_ics_file = ical.sync.parseFile(new_ics);
            old_ics_file = ical.sync.parseFile(old_ics);

            new_events = [];
            for (const event of Object.values(new_ics_file)) {
                new_events.push(event.uid);
            };

            let i = 0;
            event_to_delete = {};
            for (const event of Object.values(old_ics_file)) {
                if (!new_events.includes(event.uid)) {
                    event_to_delete[event.uid] = event;
                    i++;
                }
            };

            console.log(`[${chalk.green("INFO")}][${logDate()}][+] ${i} events to delete`);

            if (i == 0) {

                const file = readline.createInterface({
                    input: fs.createReadStream(new_ics),
                    output: process.stdout,
                    terminal: false
                });

                let line = "";
                file.on('line', (l) => {
                    line += l + "\n";
                });

                file.on('close', () => {
                    fs.writeFile(old_ics, line + line_old, function (err) {
                        if (err) throw err;
                        return;
                    });
                });

            }

            // read by line
            const file = readline.createInterface({
                input: fs.createReadStream(new_ics),
                output: process.stdout,
                terminal: false
            });

            // add to penultimate line the new events to delete
            let line = "";
            file.on('line', (l) => {
                if (l.includes("END:VCALENDAR")) {
                    let i = 0;
                    for (const event of Object.values(event_to_delete)) {
                        const start = new Date(event.start);
                        const start_iso = start.toISOString().replace(/-/g, "").replace(/:/g, "").replace(/\./g, "").replace(/T/g, "");

                        const end = new Date(event.end);
                        const end_iso = end.toISOString().replace(/-/g, "").replace(/:/g, "").replace(/\./g, "").replace(/T/g, "");

                        const stamp = new Date(event.dtstamp);
                        const stamp_iso = stamp.toISOString().replace(/-/g, "").replace(/:/g, "").replace(/\./g, "").replace(/T/g, "");

                        // break line remove
                        event.description = event.description.replace(/\n/g, " ");

                        line += (i == 0 ? "METHOD:CANCEL\n" : null);
                        line += "BEGIN:VEVENT\n";
                        line += `UID:${event.uid}\n`;
                        line += `DTSTAMP:${stamp_iso}\n`;
                        line += `DTSTART:${start_iso}\n`;
                        line += `DTEND:${end_iso}\n`;
                        line += `SUMMARY:${event.summary}\n`;
                        line += `DESCRIPTION:${event.description}\n`;
                        line += `LOCATION:${event.location}\n`;
                        line += `STATUS:CANCELLED\n`;
                        line += `END:VEVENT\n`;
                        i++;
                    }
                }
                line += l + "\n";
            }
            );

            // write the new file
            file.on('close', () => {
                line += line_old;
                fs.writeFile(old_ics, line, (err) => {
                    if (err) {
                        console.log(`[${chalk.red("ERROR")}][${logDate()}][!] Error while writing file ${err}`);
                    }
                    else {
                        console.log(`[${chalk.green("INFO")}][${logDate()}][+] File written`);

                        // fs.rename(new_ics, old_ics, (err) => {
                        //     if (err) {
                        //         console.log(`[${chalk.red("ERROR")}][${logDate()}][!] Error while moving file ${err}`);
                        //     }
                        //     else {
                        //         console.log(`[${chalk.green("INFO")}][${logDate()}][+] File moved`);

                        //         return;
                        //     }
                        // });
                    }
                }
                );
            }
            );
        }
        );
    });
}


module.exports = remove_old_event;