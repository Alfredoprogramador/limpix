# 🚀 Comandos Rápidos - Limpix

## 📦 Instalação Inicial

```bash
# 1. Instalar/Atualizar dependências
npm install

# 2. Abrir no VS Code
code .
```

## ▶️ Executar o Projeto

```bash
# Iniciar Metro Bundler (escolha a plataforma depois)
npm start

# Ou iniciar diretamente em uma plataforma:
npm run web       # Navegador (localhost:19006)
npm run android   # Android
npm run ios       # iOS (somente macOS)
```

## 🧹 Limpeza e Reset

```bash
# Limpar cache do Expo
npx expo start -c

# Resetar completamente
rm -rf node_modules package-lock.json .expo
npm install

# Limpar cache do Metro Bundler
npx expo start --clear
```

## 🔧 TypeScript

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# Verificar versão do TypeScript
npx tsc --version

# No VS Code: Ctrl+Shift+P → TypeScript: Restart TS Server
```

## 📱 Testando

```bash
# Web - Abre automaticamente no navegador
npm run web

# Android - Requer Android Studio e emulador
npm run android

# iOS - Requer macOS e Xcode
npm run ios

# Scan QR Code - Use Expo Go no celular
npm start
```

## 🎨 Formatação de Código

```bash
# Formatar arquivo atual no VS Code
Shift + Alt + F

# Formatar todos os arquivos
npx prettier --write .
```

## 📊 Informações do Projeto

```bash
# Ver dependências instaladas
npm list --depth=0

# Ver informações do Expo
npx expo --version

# Diagnosticar problemas
npx expo-doctor
```

## 🔍 Debug

```bash
# No VS Code:
# Pressione F5 e selecione:
# - Expo: Start Web
# - Expo: Start Android
# - Expo: Start iOS

# Ver logs detalhados
npx expo start --dev-client

# Abrir DevTools do React Native
# Durante execução, pressione:
# - Web: F12 (Chrome DevTools)
# - Android/iOS: Shake device → Debug
```

## 🌐 Variáveis de Ambiente

```bash
# Desenvolvimento
NODE_ENV=development npm start

# Produção (build)
NODE_ENV=production npm run build
```

## 📦 Gerenciamento de Pacotes

```bash
# Adicionar nova dependência
npm install <pacote>

# Adicionar dependência de desenvolvimento
npm install -D <pacote>

# Remover dependência
npm uninstall <pacote>

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated
```

## 🚀 Build e Deploy

```bash
# Build para web
npx expo export:web

# Build para Android (APK)
eas build --platform android

# Build para iOS (somente macOS)
eas build --platform ios

# Publicar no Expo
npx expo publish
```

## 🎯 Atalhos do VS Code

```
Ctrl + P              → Busca rápida de arquivos
Ctrl + Shift + F      → Buscar em todo projeto
Ctrl + `              → Terminal
Ctrl + B              → Toggle sidebar
F5                    → Iniciar debug
Ctrl + Shift + P      → Command Palette
F12                   → Ir para definição
Shift + F12           → Ver referências
F2                    → Renomear símbolo
Shift + Alt + F       → Formatar documento
Ctrl + /              → Comentar/descomentar
```

## 🐛 Resolver Problemas Comuns

```bash
# Erro: "Cannot find module"
npm install
# No VS Code: Ctrl+Shift+P → TypeScript: Restart TS Server

# Erro: "Port 19000 already in use"
npx kill-port 19000 19001 19002

# Erro: Cache do Expo corrompido
npx expo start -c
rm -rf .expo

# Erro: node_modules corrompido
rm -rf node_modules package-lock.json
npm install

# Erro: TypeScript não reconhece tipos
# No VS Code:
# Ctrl+Shift+P → TypeScript: Select TypeScript Version
# Selecione "Use Workspace Version"
```

## 📚 Recursos Úteis

```bash
# Documentação Expo
https://docs.expo.dev/

# React Native Docs
https://reactnative.dev/

# TypeScript Docs
https://www.typescriptlang.org/docs/

# React Navigation
https://reactnavigation.org/

# Expo Forums (ajuda)
https://forums.expo.dev/
```

---

**💡 Dica:** Salve este arquivo nos favoritos para consulta rápida!
