@echo off
echo ==========================================
echo   PREPARAR PROJETO PARA TESTES - LIMPIX
echo ==========================================
echo.

echo [1/5] Limpando instalacao anterior...
if exist node_modules (
    echo Removendo node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del package-lock.json
)
echo OK!
echo.

echo [2/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK!
echo.

echo [3/5] Verificando compatibilidade...
call npx expo-doctor --fix-dependencies
echo.

echo [4/5] Limpando cache...
call npx expo start -c --clear
timeout /t 2 >nul
echo OK!
echo.

echo [5/5] Projeto pronto para testar!
echo.
echo ==========================================
echo   ESCOLHA UMA OPCAO PARA TESTAR:
echo ==========================================
echo.
echo 1. Testar no Android
echo 2. Testar no iOS (apenas macOS)
echo 3. Testar na Web
echo 4. Abrir Expo DevTools
echo.
set /p choice="Digite sua escolha (1-4): "

if "%choice%"=="1" (
    echo.
    echo Iniciando no Android...
    call npm run android
)
if "%choice%"=="2" (
    echo.
    echo Iniciando no iOS...
    call npm run ios
)
if "%choice%"=="3" (
    echo.
    echo Iniciando na Web...
    call npm run web
)
if "%choice%"=="4" (
    echo.
    echo Abrindo Expo DevTools...
    call npm start
)

pause
