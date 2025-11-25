
sudo mkdir -p /var/www/votetest

npm run build
sudo rm -rf /var/www/votetest/*
sudo cp -r dist/* /var/www/votetest/
ls /var/www/votetest

sudo nano /etc/caddy/Caddyfile

sudo systemctl reload caddy