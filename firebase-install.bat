@echo off
echo ==========================================
echo   INSTALANDO FIREBASE - LIMPIX
echo ==========================================
echo.

echo [1/3] Instalando Firebase Core...
call npm install firebase

echo.
echo [2/3] Instalando Firebase Tools CLI...
call npm install -g firebase-tools

echo.
echo [3/3] Instalando dependencias extras...
call npm install @react-native-async-storage/async-storage

echo.
echo ==========================================
echo   INSTALACAO CONCLUIDA!
echo ==========================================
echo.
echo Proximo passo:
echo 1. firebase login
echo 2. firebase init
echo.

pause
