

sudo mkdir -p /var/www/admin25


npm run build
sudo rm -rf /var/www/admin25/*
sudo cp -r dist/* /var/www/admin25/
ls /var/www/admin25

sudo nano /etc/caddy/Caddyfile

sudo systemctl reload caddy