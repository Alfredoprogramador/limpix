@echo off
echo ========================================
echo   LIMPIX - INSTALACAO E EXECUCAO
echo ========================================
echo.

echo [1/4] Limpando instalacao anterior...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo OK!
echo.

echo [2/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK!
echo.

echo [3/4] Verificando compatibilidade...
call npx expo-doctor
echo.

echo [4/4] Iniciando projeto...
echo.
echo ========================================
echo   PROJETO PRONTO!
echo ========================================
echo.
echo Escolha uma opcao:
echo   a - Android
echo   i - iOS (apenas macOS)
echo   w - Web
echo.
echo Ou escaneie o QR Code com Expo Go
echo.

call npm start

pause
