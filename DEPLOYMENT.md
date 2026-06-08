# RatedDocs PWA & SSL Deployment Guide

To make the Progressive Web App (PWA) installable on your AWS EC2 instance, the browser enforces that the site **MUST be served over HTTPS** (SSL). If it is served over plain HTTP, the browser will refuse to register the Service Worker and the "Install" button will not appear.

Here are the two recommended ways to configure HTTPS on AWS EC2.

---

## Option 1: Using Caddy as a Reverse Proxy (Recommended - Easiest & Free)

Caddy is a modern web server that automatically provisions, configures, and renews SSL certificates from Let's Encrypt for your domain.

### Step 1: Update the Docker Run Port
Change your docker container to run on an internal port (e.g., `3000`) instead of port `80`, so Caddy can listen on ports `80` and `443` on the host.

In `.github/workflows/deploy.yml`, change the port mapping:
```yaml
            echo "→ Running new container..."
            docker run -d \
              --name rated-docs-website \
              --restart unless-stopped \
              -p 3000:3000 \
              "$IMAGE"
```

### Step 2: Install Caddy on EC2
Connect to your EC2 instance via SSH and run:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y
```

### Step 3: Configure the Caddyfile
Open the configuration file:
```bash
sudo nano /etc/caddy/Caddyfile
```

Replace its contents with:
```caddy
yourdomain.com {
    reverse_proxy localhost:3000
}
```
*(Replace `yourdomain.com` with your actual domain. Make sure your domain's DNS A-record points to your EC2 public IP).*

### Step 4: Restart Caddy
```bash
sudo systemctl restart caddy
```
Caddy will automatically request Let's Encrypt SSL certificates and serve your site securely over `https://yourdomain.com`.

---

## Option 2: Using AWS Application Load Balancer + ACM (Enterprise / Scalable)

If you prefer to keep your EC2 port mapping as `-p 80:3000` and manage SSL through AWS Certificate Manager (ACM):

1. **Request an SSL Certificate**: Go to AWS Certificate Manager (ACM) and request a public certificate for `yourdomain.com`.
2. **Create a Target Group**: Create an HTTP target group pointing to your EC2 instance on Port `80`.
3. **Create an Application Load Balancer (ALB)**:
   * Add a listener for **HTTPS (Port 443)** using your ACM certificate.
   * Forward traffic to the target group created in step 2.
   * Add an **HTTP (Port 80)** listener that redirects all requests to **HTTPS (Port 443)**.
4. **Point DNS to ALB**: Update your domain DNS settings (Route 53 or other DNS provider) to point to the ALB's DNS name using a CNAME or Alias record.
5. **Security Groups**: Ensure your EC2 security group only allows incoming traffic from the ALB.