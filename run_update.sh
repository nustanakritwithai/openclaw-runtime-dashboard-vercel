#!/usr/bin/env bash
#
# run_update.sh — Run update_metrics.py from the repo root and log output.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/update_metrics.log"

echo "--- $(date -u '+%Y-%m-%dT%H:%M:%SZ') ---" >> "$LOG_FILE"

if ! python3 "${SCRIPT_DIR}/update_metrics.py" >> "$LOG_FILE" 2>&1; then
    echo "ERROR: update_metrics.py failed. See ${LOG_FILE}" >&2
    exit 1
fi

echo "Done. Log written to ${LOG_FILE}"
