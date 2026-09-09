# 🚀 Bibliotheca - Free Live Hosting & Phone Access Guide

This guide details how to access Bibliotheca on your phone immediately, and how to host it live online **100% free with zero fees or credit cards**.

---

## 📱 Option 1: Instant Phone Access (On Same Wi-Fi)

You can already access Bibliotheca on your smartphone right now without deploying anywhere!

1. Make sure your phone is connected to the **same Wi-Fi** network as this PC.
2. In the Bibliotheca web app on your computer, click the **"📱 Open on Phone"** button in the top navigation bar.
3. You will see:
   - **Local Network URL**: `http://192.168.1.11:3000`
   - **QR Code**: Scan this QR code directly with your iPhone Camera or Android Google Lens / Camera app.
4. The page will immediately open on your mobile browser with full responsive reading layout, ambient sounds, and text-to-speech!

> **Troubleshooting tip**: If your phone doesn't load the page, Windows Firewall might be blocking incoming connections to port 3000. In Windows PowerShell as Administrator, run:  
> `New-NetFirewallRule -DisplayName "Bibliotheca Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow`

---

## ☁️ Option 2: Deploy Free Online with Render.com (Recommended)

Render offers a permanent **Free Web Service tier** with free automatic SSL (HTTPS), custom domain support, and continuous deployments from GitHub.

### Step-by-Step Instructions:
1. **Push your code to GitHub**:
   - Create a free repository on [github.com](https://github.com) (e.g. `bibliotheca-reader`).
   - In your project folder, initialize git and push:
     ```bash
     git init
     git add .
     git commit -m "Initial commit of Bibliotheca"
     git branch -M main
     git remote add origin https://github.com/<your-username>/bibliotheca-reader.git
     git push -u origin main
     ```
2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and sign in with your GitHub account.
   - Click **New +** -> **Web Service**.
   - Connect your `bibliotheca-reader` GitHub repository.
   - Settings:
     - **Name**: `bibliotheca` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: (leave empty or `npm install`)
     - **Start Command**: `node server.mjs`
     - **Plan Type**: `Free`
   - Click **Create Web Service**.
3. **Done!** In 1-2 minutes, your website will be live at `https://bibliotheca-xxxx.onrender.com`. You can bookmark and open this on any phone, anywhere in the world!

---

## ⚡ Option 3: Deploy Free with Railway.app

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `bibliotheca-reader` repo.
4. Click **Deploy Now**.
5. Under service settings, click **Generate Domain** to get your public `.up.railway.app` URL.

---

## 🌐 Option 4: Instant Public Tunnel via Cloudflare / Localtunnel (No Sign-up Needed)

If you want an instant HTTPS link to share or open on mobile while your PC is running:

Using **localtunnel** (zero install):
```bash
npx localtunnel --port 3000
```
It outputs a public link like `https://quiet-tree-82.loca.lt` that works from any mobile network worldwide!
