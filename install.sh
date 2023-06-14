## Fedora


## install node js and npm
dnf install nodejs npm -y

npm install

## open firewall port 3000
firewall-cmd --add-port=3000/tcp --permanent

## reload firewall
firewall-cmd --reload