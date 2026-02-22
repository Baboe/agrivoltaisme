Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($env:GIT_SSH_KEY)) {
  throw 'GIT_SSH_KEY is not set'
}

$repoSsh = if ([string]::IsNullOrWhiteSpace($env:OMBAA_REPO_SSH)) { 'git@github.com:baboe/ombaa.git' } else { $env:OMBAA_REPO_SSH }
$branch = if ([string]::IsNullOrWhiteSpace($env:OMBAA_BRANCH)) { 'main' } else { $env:OMBAA_BRANCH }

$repoRoot = Split-Path -Parent $PSScriptRoot
$defaultOmbasDir = Join-Path (Split-Path -Parent $repoRoot) 'ombaa'
$ombaaDir = if ([string]::IsNullOrWhiteSpace($env:OMBAA_DIR)) { $defaultOmbasDir } else { $env:OMBAA_DIR }

$sshDir = Join-Path $HOME '.ssh'
$keyPath = if ([string]::IsNullOrWhiteSpace($env:OMBAA_SSH_KEY_PATH)) { Join-Path $sshDir 'ombaa_id_ed25519' } else { $env:OMBAA_SSH_KEY_PATH }
$configPath = if ([string]::IsNullOrWhiteSpace($env:OMBAA_SSH_CONFIG_PATH)) { Join-Path $sshDir 'ombaa_config' } else { $env:OMBAA_SSH_CONFIG_PATH }
$knownHostsPath = if ([string]::IsNullOrWhiteSpace($env:OMBAA_KNOWN_HOSTS_PATH)) { Join-Path $sshDir 'known_hosts_ombaa' } else { $env:OMBAA_KNOWN_HOSTS_PATH }

# 1) SSH setup
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $keyPath) | Out-Null

$key = $env:GIT_SSH_KEY -replace "`r", ""
if (-not $key.EndsWith("`n")) { $key += "`n" }
[System.IO.File]::WriteAllText($keyPath, $key, [System.Text.Encoding]::ASCII)

New-Item -ItemType File -Force -Path $knownHostsPath | Out-Null

try {
  $scanLines = & ssh-keyscan github.com 2>$null
} catch {
  $scanLines = @()
}

$validScanLines =
  $scanLines |
  Where-Object { $_ -match '^(\[?github\.com\]?:\d+|github\.com|\d+\.\d+\.\d+\.\d+)\s+ssh-' }

if ($validScanLines.Count -gt 0) {
  Add-Content -Path $knownHostsPath -Value $validScanLines -Encoding ascii
} else {
  # Fallback for environments where ssh-keyscan fails (e.g. some OpenSSH builds)
  & ssh `
    -o BatchMode=yes `
    -o StrictHostKeyChecking=accept-new `
    -o ("UserKnownHostsFile=" + $knownHostsPath) `
    -o IdentitiesOnly=yes `
    -o ("IdentityFile=" + $keyPath) `
    -T git@github.com `
    2>$null | Out-Null
}

$config = @"
Host github.com
  IdentityFile "$keyPath"
  IdentitiesOnly yes
  UserKnownHostsFile "$knownHostsPath"
  StrictHostKeyChecking yes
"@
[System.IO.File]::WriteAllText($configPath, $config, [System.Text.Encoding]::ASCII)

$env:GIT_SSH_COMMAND = "ssh -F `"$configPath`""

# 2) Clone or update repo
if (-not (Test-Path (Join-Path $ombaaDir '.git'))) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ombaaDir) | Out-Null
  git clone --branch $branch $repoSsh $ombaaDir
} else {
  git -C $ombaaDir fetch origin $branch
  git -C $ombaaDir reset --hard ("origin/" + $branch)
  git -C $ombaaDir clean -fd
}

Write-Host "[bootstrap] Ombaa ready at: $ombaaDir"
git -C $ombaaDir rev-parse --short HEAD
