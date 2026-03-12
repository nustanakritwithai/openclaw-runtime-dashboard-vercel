#!/usr/bin/env python3
"""
update_metrics.py — Fetch, update, and push public/metrics.json via the GitHub Contents API.

Required env var:
    GITHUB_TOKEN   — A GitHub Personal Access Token with repo (contents) write permission.

Optional env var overrides:
    REPO_OWNER     (default: nustanakritwithai)
    REPO_NAME      (default: openclaw-runtime-dashboard-vercel)
    FILE_PATH      (default: public/metrics.json)
    BRANCH         (default: repo's default branch)
"""

import base64
import json
import os
import random
import sys
from datetime import datetime, timezone

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    print("ERROR: GITHUB_TOKEN environment variable is not set.", file=sys.stderr)
    sys.exit(1)

REPO_OWNER = os.environ.get("REPO_OWNER", "nustanakritwithai")
REPO_NAME = os.environ.get("REPO_NAME", "openclaw-runtime-dashboard-vercel")
FILE_PATH = os.environ.get("FILE_PATH", "public/metrics.json")
BRANCH = os.environ.get("BRANCH")  # None → use repo default

API_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FILE_PATH}"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def clamp(value, lo, hi):
    """Clamp a numeric value between lo and hi."""
    return max(lo, min(hi, value))


def drift(current, lo, hi, max_delta):
    """Apply a random drift to *current*, keeping the result in [lo, hi]."""
    delta = random.uniform(-max_delta, max_delta)
    return round(clamp(current + delta, lo, hi), 1)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # 1. Fetch current file ---------------------------------------------------
    params = {}
    if BRANCH:
        params["ref"] = BRANCH

    resp = requests.get(API_URL, headers=HEADERS, params=params, timeout=30)
    if resp.status_code != 200:
        print(f"ERROR: Failed to fetch {FILE_PATH} (HTTP {resp.status_code}).", file=sys.stderr)
        print(resp.text, file=sys.stderr)
        sys.exit(1)

    payload = resp.json()
    sha = payload["sha"]
    content_b64 = payload["content"]
    current = json.loads(base64.b64decode(content_b64))

    print(f"Fetched {FILE_PATH} (sha={sha[:8]})")

    # 2. Derive next metrics --------------------------------------------------
    sys_info = current.get("system", {})
    req_info = current.get("requests", {})

    # CPU: drift ±5, stay in 15–45
    cpu = drift(sys_info.get("cpu_percent", 30), 15, 45, 5)

    # Memory: drift ±64 MB, stay in 800–3500 (of 4096 total)
    mem_used = drift(sys_info.get("memory_used_mb", 1500), 800, 3500, 64)
    mem_total = sys_info.get("memory_total_mb", 4096)

    # Uptime: increase ~300 s ± 30 s
    uptime = sys_info.get("uptime_seconds", 0) + random.randint(270, 330)

    # Requests: add a realistic batch
    new_requests = random.randint(80, 250)
    new_errors = random.randint(0, max(1, int(new_requests * 0.05)))
    new_success = new_requests - new_errors

    total = req_info.get("total", 0) + new_requests
    success = req_info.get("success", 0) + new_success
    errors = req_info.get("errors", 0) + new_errors

    # Avg response time: drift ±8 ms, stay in 50–300
    avg_ms = drift(req_info.get("avg_response_ms", 120), 50, 300, 8)

    # Timestamp in UTC ending in Z
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    updated = {
        "timestamp": timestamp,
        "system": {
            "cpu_percent": cpu,
            "memory_used_mb": round(mem_used),
            "memory_total_mb": mem_total,
            "uptime_seconds": uptime,
        },
        "requests": {
            "total": total,
            "success": success,
            "errors": errors,
            "avg_response_ms": round(avg_ms),
        },
    }

    # 3. Push updated file back -----------------------------------------------
    new_content = json.dumps(updated, indent=2) + "\n"
    encoded = base64.b64encode(new_content.encode()).decode()

    put_body = {
        "message": f"Update metrics — {timestamp}",
        "content": encoded,
        "sha": sha,
    }
    if BRANCH:
        put_body["branch"] = BRANCH

    put_resp = requests.put(API_URL, headers=HEADERS, json=put_body, timeout=30)
    if put_resp.status_code not in (200, 201):
        print(f"ERROR: Failed to update {FILE_PATH} (HTTP {put_resp.status_code}).", file=sys.stderr)
        print(put_resp.text, file=sys.stderr)
        sys.exit(1)

    new_sha = put_resp.json()["content"]["sha"]
    print(f"SUCCESS: {FILE_PATH} updated (new sha={new_sha[:8]})")
    print(f"  timestamp : {timestamp}")
    print(f"  cpu       : {cpu}%")
    print(f"  memory    : {round(mem_used)}/{mem_total} MB")
    print(f"  uptime    : {uptime}s")
    print(f"  requests  : {total} total, {success} ok, {errors} err, {round(avg_ms)} ms avg")


if __name__ == "__main__":
    main()
