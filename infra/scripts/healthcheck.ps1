param([string]$EnvFile = ".env")

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$lines = Get-Content $EnvFile | Where-Object { $_ -match '^[^#]' -and $_ -match '=' }
foreach ($line in $lines) {
    $parts = $line -split '=', 2
    Set-Variable -Name $parts[0].Trim() -Value $parts[1].Trim() -Scope Script
}

$port = if ($HTTP_PORT) { $HTTP_PORT } else { 8080 }
$base = "http://localhost:$port"

Write-Host "Gateway: $base/health"
Invoke-WebRequest -Uri "$base/health" -UseBasicParsing | Select-Object -ExpandProperty Content

Write-Host "API: $base/up"
Invoke-WebRequest -Uri "$base/up" -UseBasicParsing | Select-Object StatusCode

docker compose --env-file $EnvFile exec -T api php artisan health:check
Write-Host "OK"
