#!/usr/bin/env bash
set -euo pipefail

: "${GIT_SSH_KEY:?GIT_SSH_KEY is not set}"
: "${OMBAA_REPO_SSH:=git@github.com:baboe/ombaa.git}"
: "${OMBAA_BRANCH:=main}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
: "${OMBAA_DIR:="$REPO_ROOT/../ombaa"}"

: "${OMBAA_SSH_KEY_PATH:="$HOME/.ssh/ombaa_id_ed25519"}"
: "${OMBAA_SSH_CONFIG_PATH:="$HOME/.ssh/ombaa_config"}"
: "${OMBAA_KNOWN_HOSTS_PATH:="$HOME/.ssh/known_hosts_ombaa"}"

# 1) SSH setup
mkdir -p "$(dirname "$OMBAA_SSH_KEY_PATH")"
chmod 700 "$(dirname "$OMBAA_SSH_KEY_PATH")"

# Write private key (CRLF-safe)
printf '%s\n' "$GIT_SSH_KEY" | tr -d '\r' > "$OMBAA_SSH_KEY_PATH"
chmod 600 "$OMBAA_SSH_KEY_PATH"

# Known hosts (avoid interactive prompt)
touch "$OMBAA_KNOWN_HOSTS_PATH"
chmod 644 "$OMBAA_KNOWN_HOSTS_PATH"

if ! ssh-keyscan github.com >> "$OMBAA_KNOWN_HOSTS_PATH" 2>/dev/null; then
  # Fallback for environments where ssh-keyscan fails (e.g. some OpenSSH builds)
  ssh \
    -o BatchMode=yes \
    -o StrictHostKeyChecking=accept-new \
    -o UserKnownHostsFile="$OMBAA_KNOWN_HOSTS_PATH" \
    -T git@github.com \
    >/dev/null 2>&1 || true
fi

# Force git/ssh to use this key + known_hosts file (don't touch user's default ssh config)
cat > "$OMBAA_SSH_CONFIG_PATH" << EOF
Host github.com
  IdentityFile "$OMBAA_SSH_KEY_PATH"
  IdentitiesOnly yes
  UserKnownHostsFile "$OMBAA_KNOWN_HOSTS_PATH"
  StrictHostKeyChecking yes
EOF
chmod 600 "$OMBAA_SSH_CONFIG_PATH"

export GIT_SSH_COMMAND="ssh -F $OMBAA_SSH_CONFIG_PATH"

# 2) Clone or update repo
if [ ! -d "$OMBAA_DIR/.git" ]; then
  mkdir -p "$(dirname "$OMBAA_DIR")"
  git clone --branch "$OMBAA_BRANCH" "$OMBAA_REPO_SSH" "$OMBAA_DIR"
else
  git -C "$OMBAA_DIR" fetch origin "$OMBAA_BRANCH"
  git -C "$OMBAA_DIR" reset --hard "origin/$OMBAA_BRANCH"
  git -C "$OMBAA_DIR" clean -fd
fi

echo "[bootstrap] Ombaa ready at: $OMBAA_DIR"
git -C "$OMBAA_DIR" rev-parse --short HEAD
