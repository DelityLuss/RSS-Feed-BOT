## Fedora


## install node js and npm
dnf install nodejs npm -y

npm install

## create task for cron job to run every day at 00:00
crontab -l > mycron
echo "0 0 * * * /usr/bin/node /home/$(whoami)/$(basename $(pwd))/auto_refresh.js" >> mycron
crontab mycron

## remove temp file
rm mycron

## start cron service
systemctl start crond.service

## enable cron service
systemctl enable crond.service

## open firewall port 3000
firewall-cmd --zone=public --add-port=3000/tcp --permanent

## reload firewall
firewall-cmd --reload