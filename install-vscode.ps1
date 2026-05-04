#!/bin/bash
# Script de instalação automática para Windows (PowerShell)
# Execute este arquivo com: .\install-vscode.ps1

Write-Host "🚀 Configurando projeto Limpix para VS Code..." -ForegroundColor Cyan
Write-Host ""

# 1. Atualizar TypeScript
Write-Host "📦 Atualizando TypeScript para versão mais recente..." -ForegroundColor Yellow
npm install

# 2. Verificar instalação
Write-Host ""
Write-Host "✅ Verificando instalação..." -ForegroundColor Green
npx tsc --version

# 3. Instruções finais
Write-Host ""
Write-Host "🎉 Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Feche o Visual Studio (se aberto)"
Write-Host "  2. Abra este projeto no VS Code: code ."
Write-Host "  3. Instale as extensões recomendadas (notificação aparecerá)"
Write-Host "  4. Pressione Ctrl+Shift+P e execute: TypeScript: Restart TS Server"
Write-Host "  5. Execute: npm start"
Write-Host ""
Write-Host "📖 Leia o arquivo VSCODE_SETUP.md para mais detalhes" -ForegroundColor Yellow
Write-Host ""
