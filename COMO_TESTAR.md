# 🚀 GUIA DE INSTALAÇÃO E TESTES - LIMPIX

## ⚠️ PROBLEMA: PowerShell Bloqueando Scripts

Você está recebendo este erro:
```
npm : O arquivo F:\Program Files\npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada
```

---

## ✅ SOLUÇÕES

### OPÇÃO 1: Usar CMD ao invés de PowerShell (RECOMENDADO)

1. **Fechar o terminal PowerShell atual**
2. **Abrir CMD** (Prompt de Comando):
   - Pressione `Win + R`
   - Digite `cmd`
   - Enter
3. **Navegar até a pasta do projeto:**
   ```cmd
   cd /d "C:\caminho\para\seu\projeto"
   ```
4. **Executar:**
   ```cmd
   instalar.cmd
   ```

---

### OPÇÃO 2: Liberar Execução de Scripts no PowerShell

**⚠️ ATENÇÃO: Isso reduz a segurança do sistema**

1. **Abrir PowerShell como Administrador:**
   - Win + X → "Windows PowerShell (Admin)"

2. **Executar este comando:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Confirmar com `S` (Sim)**

4. **Fechar e reabrir o terminal normal**

5. **Agora pode executar:**
   ```powershell
   npm install
   ```

---

### OPÇÃO 3: Instalar Manualmente (Sem Scripts)

**Abra o CMD ou PowerShell (Admin) e execute linha por linha:**

```cmd
REM 1. Limpar instalação anterior (opcional)
rmdir /s /q node_modules
del package-lock.json

REM 2. Instalar dependências
npm install

REM 3. Verificar problemas
npx expo-doctor

REM 4. Iniciar o app
npm start
```

---

## 📱 COMO TESTAR O APP

### Após `npm start`, você verá um QR Code. Escolha:

#### **ANDROID** 📱
1. Instalar Expo Go:
   - Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent
2. Abrir Expo Go
3. Escanear o QR Code
4. OU executar: `npm run android` (requer Android Studio)

#### **iOS** 🍎
1. Instalar Expo Go:
   - App Store: https://apps.apple.com/app/expo-go/id982107779
2. Abrir Camera
3. Escanear QR Code
4. OU executar: `npm run ios` (requer Xcode, apenas macOS)

#### **WEB** 🌐
```cmd
npm run web
```
Abrirá automaticamente em `http://localhost:19006`

---

## 🐛 PROBLEMAS COMUNS

### ❌ Erro: `EJSONPARSE`
**Causa:** package.json inválido  
**Solução:** ✅ **JÁ CORRIGIDO!** Vírgulas faltando foram adicionadas.

### ❌ Erro: `command not found: npm`
**Causa:** Node.js não instalado  
**Solução:** Baixar em https://nodejs.org (versão LTS)

### ❌ Expo Doctor reporta incompatibilidades
**Solução:**
```cmd
npx expo-doctor --fix-dependencies
```

### ❌ Porta 8081 ou 19000 em uso
**Solução:**
```cmd
npx expo start -c --clear
```
Ou escolher outra porta:
```cmd
npx expo start --port 8082
```

### ❌ App trava na splash screen
**Causa:** Banco SQLite não inicializou  
**Solução:** Verificar logs e limpar cache:
```cmd
npx expo start -c
```

---

## 📋 CHECKLIST PRÉ-TESTE

- [ ] Node.js instalado (v18+)
- [ ] npm funcionando
- [ ] Dependências instaladas (`node_modules` existe)
- [ ] package.json válido (✅ corrigido)
- [ ] Firebase configurado? (opcional)
  - [ ] Credenciais em `src/config/firebase.config.ts`
  - [ ] `firebase login` executado
  - [ ] Regras deployadas (`firebase deploy --only firestore:rules,storage`)

---

## 🎯 FLUXO DE TESTE RECOMENDADO

### 1. **Instalar**
```cmd
cd /d "caminho\do\projeto"
npm install
```

### 2. **Verificar**
```cmd
npx expo-doctor
```

### 3. **Iniciar**
```cmd
npm start
```

### 4. **Escolher Plataforma**
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web
- Ou escaneie o QR Code com Expo Go

### 5. **Testar Cenários**
Siga o **PLANO_DE_TESTES.md**:
- ✅ Cadastro de cliente
- ✅ Login
- ✅ Buscar prestadores
- ✅ Criar agendamento
- etc.

---

## 📊 SCRIPTS DISPONÍVEIS

| Script | Comando | Descrição |
|--------|---------|-----------|
| Instalar | `instalar.cmd` | Limpa e instala dependências |
| Iniciar | `iniciar.cmd` | Menu interativo para testar |
| Manual | `npm start` | Expo DevTools |
| Android | `npm run android` | Testar no Android |
| iOS | `npm run ios` | Testar no iOS (macOS) |
| Web | `npm run web` | Testar no navegador |

---

## 🔥 FIREBASE (OPCIONAL)

Se quiser testar com Firebase ao invés de SQLite:

### 1. **Configurar Firebase**
Siga: `FIREBASE_SETUP_COMPLETO.md`

### 2. **Migrar App**
Siga: `MIGRACAO_FIREBASE.md`

### 3. **Testar Emuladores**
```cmd
firebase emulators:start
```

---

## 📞 SUPORTE

### Logs de Erro:
```cmd
npx expo start --clear
```

### Limpar Tudo:
```cmd
rmdir /s /q node_modules
rmdir /s /q .expo
del package-lock.json
npm install
```

### Verificar Versões:
```cmd
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
npx expo --version # ~54.0.0
```

---

## ✅ PRÓXIMOS PASSOS

1. ✅ Resolver problema do PowerShell (use CMD ou libere scripts)
2. ✅ Executar `instalar.cmd` ou `npm install`
3. ✅ Executar `iniciar.cmd` ou `npm start`
4. ✅ Testar no dispositivo/emulador
5. ✅ Seguir **PLANO_DE_TESTES.md**
6. ✅ Reportar bugs encontrados

---

**Status:** ✅ package.json corrigido | ⚠️ PowerShell bloqueando | 🚀 Pronto para instalar

**Criado por:** GitHub Copilot  
**Data:** Janeiro 2025
