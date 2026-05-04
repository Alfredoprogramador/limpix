Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LIMPIX - INSTALACAO E EXECUCAO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Limpando instalacao anterior..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}
Write-Host "OK!" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependencias" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host "OK!" -ForegroundColor Green
Write-Host ""

Write-Host "[3/4] Verificando compatibilidade..." -ForegroundColor Yellow
npx expo-doctor
Write-Host ""

Write-Host "[4/4] Iniciando projeto..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   PROJETO PRONTO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Escolha uma opcao:" -ForegroundColor White
Write-Host "  a - Android" -ForegroundColor White
Write-Host "  i - iOS (apenas macOS)" -ForegroundColor White
Write-Host "  w - Web" -ForegroundColor White
Write-Host ""
Write-Host "Ou escaneie o QR Code com Expo Go" -ForegroundColor White
Write-Host ""

npm start

Read-Host "Pressione Enter para sair"
