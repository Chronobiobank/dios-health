# One dev server on port 3000 — kills stale Next.js processes and clears Turbopack cache.
$ErrorActionPreference = "SilentlyContinue"

Write-Host "Stopping processes on ports 3000 and 3001..."
foreach ($port in 3000, 3001) {
  Get-NetTCPConnection -LocalPort $port -State Listen | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force
  }
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (Test-Path ".next") {
  Write-Host "Clearing .next cache..."
  Remove-Item -Recurse -Force ".next"
}

Write-Host ""
Write-Host "Starting dev server..."
Write-Host "  Live design preview: http://localhost:3000/dev/dashboard"
Write-Host "  Landing page:        http://localhost:3000/"
Write-Host ""

pnpm run dev
