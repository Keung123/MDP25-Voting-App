

sudo mkdir -p /var/www/vote25


npm run build
sudo rm -rf /var/www/vote25/*
sudo cp -r dist/* /var/www/vote25/
ls /var/www/vote25

sudo nano /etc/caddy/Caddyfile

sudo systemctl reload caddy