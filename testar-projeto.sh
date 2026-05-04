#!/bin/bash

echo "=========================================="
echo "  PREPARAR PROJETO PARA TESTES - LIMPIX"
echo "=========================================="
echo ""

echo "[1/5] Limpando instalacao anterior..."
if [ -d "node_modules" ]; then
    echo "Removendo node_modules..."
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi
echo "OK!"
echo ""

echo "[2/5] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependencias"
    exit 1
fi
echo "OK!"
echo ""

echo "[3/5] Verificando compatibilidade..."
npx expo-doctor --fix-dependencies
echo ""

echo "[4/5] Limpando cache..."
npx expo start -c --clear &
sleep 2
pkill -f "expo start"
echo "OK!"
echo ""

echo "[5/5] Projeto pronto para testar!"
echo ""
echo "=========================================="
echo "  ESCOLHA UMA OPCAO PARA TESTAR:"
echo "=========================================="
echo ""
echo "1. Testar no Android"
echo "2. Testar no iOS (apenas macOS)"
echo "3. Testar na Web"
echo "4. Abrir Expo DevTools"
echo ""
read -p "Digite sua escolha (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Iniciando no Android..."
        npm run android
        ;;
    2)
        echo ""
        echo "Iniciando no iOS..."
        npm run ios
        ;;
    3)
        echo ""
        echo "Iniciando na Web..."
        npm run web
        ;;
    4)
        echo ""
        echo "Abrindo Expo DevTools..."
        npm start
        ;;
    *)
        echo "Opcao invalida"
        exit 1
        ;;
esac
