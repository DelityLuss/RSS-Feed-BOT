# RSS-Feed-BOT
 
## Description
This is a simple server that will fetch ICS files from a given URL and convert them to RSS feeds. It will then serve the RSS feeds to the user. This is useful for converting ICS files from websites that do not provide RSS feeds.

## Usage
### PM2

1. Install PM2: `npm install pm2 -g`
2. Install repository: `git clone https://github.com/DelityLuss/RSS-Feed-BOT.git && cd RSS-Feed-BOT`
3. Install dependencies: `npm install`
4. Start server: `pm2 start server.js --name rss-feed-bot`
5. Save PM2 process list: `pm2 save`
6. Start PM2 on boot: `pm2 startup`


 ## License
[MIT](https://choosealicense.com/licenses/mit/)


## Credits
- @DelityLuss 
