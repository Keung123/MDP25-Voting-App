#!/usr/bin/env bash
set -e

echo "===================================================="
echo "  Ubuntu 24.04 — Node.js + PM2 + Vite + Caddy Init"
echo "===================================================="

sudo apt update -y && sudo apt upgrade -y

echo "----------------------------------------------------"
echo " Installing basic tools..."
echo "----------------------------------------------------"
sudo apt install -y git curl zip unzip ufw

echo "----------------------------------------------------"
echo " Installing NVM + Node.js 20..."
echo "----------------------------------------------------"
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

source ~/.bashrc
nvm install 20
nvm use 20
node -v
npm -v

echo "----------------------------------------------------"
echo " Installing PM2..."
echo "----------------------------------------------------"
npm install -g pm2
pm2 update

echo "----------------------------------------------------"
echo " Creating project directories..."
echo "----------------------------------------------------"
mkdir -p ~/projects
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www

echo "----------------------------------------------------"
echo " Installing Caddy (Automatic HTTPS)..."
echo "----------------------------------------------------"
sudo apt update
sudo apt install -y curl gnupg2 ca-certificates lsb-release debian-keyring debian-archive-keyring apt-transport-https

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | \
    sudo gpg --dearmor -o /usr/share/keyrings/caddy.gpg

echo "deb [signed-by=/usr/share/keyrings/caddy.gpg] \
https://dl.cloudsmith.io/public/caddy/stable/deb/ubuntu \
$(lsb_release -sc) main" | \
sudo tee /etc/apt/sources.list.d/caddy.list

sudo apt update
sudo apt install caddy

caddy version


echo "----------------------------------------------------"
echo " Allowing HTTP/HTTPS through firewall..."
echo "----------------------------------------------------"
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
echo "y" | sudo ufw enable

echo "----------------------------------------------------"
echo " Vite installed globally for convenience..."
echo "----------------------------------------------------"
npm install -g create-vite

echo "----------------------------------------------------"
echo " Initialization Completed!"
echo "----------------------------------------------------"
echo " Ready to create projects:"
echo "   cd ~/projects"
echo "   npm create vite@latest vote-frontend --template react"
echo "   npm create vite@latest votetest --template react"
echo
echo " Deploy frontend (example):"
echo "   npm run build"
echo "   sudo mkdir -p /var/www/react-test"c
echo "   sudo cp -r dist/* /var/www/react-test/"
echo
echo " Caddy config at:"
echo "   sudo nano /etc/caddy/Caddyfile"
echo
echo " Restart Caddy after editing:"

echo " git add . "
echo " git commit -m "message" "
echo " git push -u origin main "