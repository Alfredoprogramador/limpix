@echo off
echo ==========================================
echo   INICIANDO LIMPIX - EXPO DEV SERVER
echo ==========================================
echo.

if not exist "node_modules" (
    echo [!] node_modules nao encontrado
    echo Execute primeiro: instalar.cmd
    echo.
    pause
    exit /b 1
)

echo Iniciando Expo...
echo.
echo Escolha uma opcao:
echo 1 - Expo DevTools (padrao)
echo 2 - Android
echo 3 - iOS
echo 4 - Web
echo.
set /p opcao="Digite sua escolha (1-4): "

if "%opcao%"=="1" (
    call npm start
) else if "%opcao%"=="2" (
    call npm run android
) else if "%opcao%"=="3" (
    call npm run ios
) else if "%opcao%"=="4" (
    call npm run web
) else (
    echo Opcao invalida
    pause
    exit /b 1
)
