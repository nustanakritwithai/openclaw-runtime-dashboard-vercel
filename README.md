# OpenClaw Runtime Dashboard

A static Next.js dashboard ready for GitHub and Vercel deployment.

## Files included
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `next-env.d.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/hooks/use-metrics.ts`
- `public/metrics.json`

## Upload to GitHub
### Option 1: GitHub web upload
1. Create a new repository on GitHub.
2. Extract this ZIP on your computer.
3. Open your new repository page.
4. Click `Add file` → `Upload files`.
5. Drag all extracted files and folders into GitHub.
6. Commit to the `main` branch.

### Option 2: GitHub Desktop or terminal
```bash
git init
git add .
git commit -m "Initial OpenClaw dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Deploy on Vercel
1. Go to [Vercel](https://vercel.com/).
2. Sign in with GitHub.
3. Click `Add New...` → `Project`.
4. Import the GitHub repository.
5. Keep the default Next.js settings.
6. Click `Deploy`.
7. Wait for the build to finish and open the live URL.

## Update metrics.json
1. Edit `public/metrics.json`.
2. Commit and push the change to GitHub.
3. Vercel will automatically redeploy.

## Local development
```bash
npm install
npm run dev
```

## Build check
```bash
npm install
npm run build
```
