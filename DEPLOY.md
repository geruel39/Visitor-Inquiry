
## 1) Prepare repository

- Commit your code and push to GitHub (replace `origin`/`main` as needed):

```bash
git add .
git commit -m "prepare for deploy"
git push origin main
```

## 2) Backend -> Clever Cloud (Dashboard)

- Create an account at https://www.clever-cloud.com
- Create a new Node.js application and connect your GitHub repository and branch.
- In the Clever Cloud app settings, add environment variables (from `server/.env.example`) or attach the MySQL addon. Set `PORT` to `5000` or leave empty (Clever Cloud provides `PORT`).
- Deploy via dashboard or by pushing to the connected branch.

## 2a) Backend -> Clever Cloud (CLI)

Install clever-tools and deploy from your machine:

```bash
npm i -g clever-tools
clever login
clever create --type node --name my-backend-app
# set env vars (example)
clever env-set MYSQL_ADDON_HOST="..." MYSQL_ADDON_DB="..." MYSQL_ADDON_USER="..." MYSQL_ADDON_PASSWORD="..." EMAIL_USER="..." EMAIL_PASS="..." --app my-backend-app
clever deploy --app my-backend-app
```

Notes:

- Clever Cloud exposes your app at `https://<app>.cleverapps.io`.
- Ensure CORS in `server/server.js` allows requests from your Vercel domain.

## 3) Frontend -> Vercel (Dashboard)

- Create a Vercel account and import your GitHub repository.
- Set the project root to `client` when prompted (if monorepo).
- Build command: `npm run build` (or `pnpm build`), Output Directory: `dist`.
- Add Environment Variable: `VITE_API_URL` = `https://<your-backend>.cleverapps.io`.
- Deploy.

## 3a) Frontend -> Vercel (CLI)

Install Vercel CLI and deploy from `client` folder:

```bash
npm i -g vercel
cd client
vercel login
vercel --prod
```

## 4) Post-deploy checklist

- Test API endpoints: `https://<app>.cleverapps.io/api`
- Test frontend fetches against `VITE_API_URL`.
- Rotate DB/email passwords if they were committed to git.
- If secrets were committed, scrub history with `git filter-repo` or `git filter-branch` and force-push (I can help).

