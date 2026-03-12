# Cron Setup — Automated Metrics Update

Run `update_metrics.py` every 5 minutes to push fresh metrics to `public/metrics.json`.

## 1. Create a GitHub Personal Access Token

1. Go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens** (or classic tokens).
2. Click **Generate new token**.
3. For **fine-grained** tokens, grant **Contents: Read and write** on the `nustanakritwithai/openclaw-runtime-dashboard-vercel` repository.
   For **classic** tokens, select the **`repo`** scope.
4. Copy the token — you will not see it again.

## 2. Set Environment Variables

```bash
export GITHUB_TOKEN="ghp_your_token_here"

# Optional overrides (defaults shown):
# export REPO_OWNER="nustanakritwithai"
# export REPO_NAME="openclaw-runtime-dashboard-vercel"
# export FILE_PATH="public/metrics.json"
# export BRANCH="master"
```

## 3. Install Dependencies

```bash
pip install requests
```

## 4. Make the Shell Script Executable

```bash
chmod +x run_update.sh
```

## 5. Test Manually

```bash
./run_update.sh
cat update_metrics.log
```

You should see a `SUCCESS` line with the updated metrics summary.

## 6. Add a Crontab Entry (Every 5 Minutes)

```bash
crontab -e
```

Add the following line (adjust the path to your clone):

```
*/5 * * * * GITHUB_TOKEN="ghp_your_token_here" /absolute/path/to/run_update.sh
```

To verify the cron job is registered:

```bash
crontab -l
```
