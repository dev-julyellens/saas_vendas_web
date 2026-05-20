# Setup completo do stack SaaS Vendas (Windows / PowerShell)
param(
    [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not (Test-Path $EnvFile)) {
    Copy-Item ".env.example" $EnvFile
    Write-Host "Criado $EnvFile - configure APP_KEY, JWT_SECRET e senhas."
}

function Invoke-Api {
    param([string[]]$Command)
    docker compose --env-file $EnvFile exec -T api @Command
    if ($LASTEXITCODE -ne 0) {
        throw "Comando falhou: $($Command -join ' ')"
    }
}

Write-Host "==> Parando containers antigos do projeto (se existirem)..."
docker compose --env-file $EnvFile -f docker-compose.yml down --remove-orphans 2>$null
if ($LASTEXITCODE -ne 0) { $global:LASTEXITCODE = 0 }

Write-Host "==> Subindo stack Docker..."
docker compose --env-file $EnvFile -f docker-compose.yml up -d --build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> Aguardando API (30s)..."
Start-Sleep -Seconds 30

Write-Host "==> Ajustando permissoes de storage..."
docker compose --env-file $EnvFile exec -u root -T api /usr/local/bin/docker-entrypoint.sh true 2>$null
if ($LASTEXITCODE -ne 0) { $global:LASTEXITCODE = 0 }

Write-Host "==> Instalando dependencias e migrations..."

# git safe.directory (ignora erro se ja configurado)
docker compose --env-file $EnvFile exec -T api git config --global --add safe.directory /var/www/html 2>$null
if ($LASTEXITCODE -ne 0) { $global:LASTEXITCODE = 0 }

Invoke-Api @("composer", "install", "--no-interaction")

Write-Host "==> Gerando APP_KEY e JWT_SECRET (saas_vendas_api/.env)..."
Invoke-Api @("php", "artisan", "key:generate", "--force", "--no-interaction")
docker compose --env-file $EnvFile exec -T api php artisan jwt:secret --force --no-interaction 2>$null
if ($LASTEXITCODE -ne 0) { $global:LASTEXITCODE = 0 }

Invoke-Api @("php", "artisan", "migrate", "--force", "--seed", "--no-interaction")
Invoke-Api @("php", "artisan", "config:clear")

Write-Host "==> Healthcheck..."
$healthcheckScript = Join-Path $Root "scripts\healthcheck.ps1"
if (Test-Path $healthcheckScript) {
    & $healthcheckScript -EnvFile $EnvFile
}

$httpPort = 8080
if (Test-Path $EnvFile) {
    $portLine = Get-Content $EnvFile | Where-Object { $_ -match '^\s*HTTP_PORT\s*=' } | Select-Object -First 1
    if ($portLine -match '=\s*(\d+)') {
        $httpPort = $Matches[1]
    }
}

Write-Host ""
Write-Host "Stack pronto em http://localhost:$httpPort"
Write-Host "API: http://localhost:$httpPort/api/v1"
Write-Host "Login demo: admin@demo.com / password123"
