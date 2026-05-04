@echo off
echo ==========================================
echo   INSTALANDO DEPENDENCIAS - LIMPIX
echo ==========================================
echo.

echo [1/2] Instalando pacotes npm...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/2] Verificando instalacao...
call npx expo-doctor
echo.
echo ==========================================
echo   INSTALACAO CONCLUIDA!
echo ==========================================
echo.
echo Para testar o projeto, execute:
echo   npm start     - Expo DevTools
echo   npm run android   - Testar no Android
echo   npm run ios       - Testar no iOS
echo   npm run web       - Testar no navegador
echo.
pause
