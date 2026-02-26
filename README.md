# Verbe Agency Pulse

Interactive revenue dashboard for Verbe Digital. Auto-updates from Google Sheets.

## Quick Start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `verbe-dashboard`)
2. Push this folder to `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/verbe-dashboard.git
   git push -u origin main
   ```
3. In your repo, go to **Settings → Pages**
4. Under **Source**, select **GitHub Actions**
5. The included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically
6. After a minute or two, your dashboard will be live at:
   `https://YOUR_USERNAME.github.io/verbe-dashboard/`
7. Bookmark that URL — every push to `main` auto-redeploys

## How Live Data Works

The dashboard fetches CSV data from your published Google Sheets tabs on page load. If the fetch fails, it falls back to hardcoded data. The green/amber indicator in the sidebar shows which mode is active.

To update the data, just edit the Google Sheet — the dashboard picks up changes on next page refresh.
