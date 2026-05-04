# 🔥 GUIA COMPLETO - FIREBASE SETUP LIMPIX

## 📋 ÍNDICE
1. [Criar Projeto Firebase](#1-criar-projeto-firebase)
2. [Configurar Authentication](#2-configurar-authentication)
3. [Configurar Firestore](#3-configurar-firestore)
4. [Configurar Storage](#4-configurar-storage)
5. [Obter Credenciais](#5-obter-credenciais)
6. [Configurar no Projeto](#6-configurar-no-projeto)
7. [Deploy das Regras](#7-deploy-das-regras)
8. [Testar Localmente](#8-testar-localmente)

---

## 1️⃣ CRIAR PROJETO FIREBASE

### Passo a Passo:

1. **Acesse:** https://console.firebase.google.com
2. **Clique em:** "Adicionar projeto" / "Add project"
3. **Nome do projeto:** `Limpix`
4. **Google Analytics:** ✅ Habilitar (recomendado)
5. **Conta do Analytics:** Criar nova ou usar existente
6. **Criar projeto** (aguarde ~30 segundos)

---

## 2️⃣ CONFIGURAR AUTHENTICATION

### Ativar Email/Password:

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Get started"**
3. Aba **"Sign-in method"**
4. Clique em **"Email/Password"**
5. ✅ **Habilitar** "Email/Password"
6. ❌ **Desabilitar** "Email link (passwordless sign-in)" (por enquanto)
7. **Salvar**

### Opcional - Outros Métodos:

Você pode ativar depois:
- 🔵 Google Sign-In
- 📘 Facebook Login
- 🍎 Apple Sign-In
- 📱 Phone Authentication

---

## 3️⃣ CONFIGURAR FIRESTORE

### Criar Database:

1. No menu lateral, clique em **"Firestore Database"**
2. **Criar banco de dados**
3. **Modo:**
   - Escolha: **"Modo de produção"** (Production mode)
   - ⚠️ Usaremos regras customizadas que já criamos
4. **Localização:**
   - Escolha: **`southamerica-east1` (São Paulo)** ✅ Recomendado
   - Ou: `us-central1` (mais barato)
5. **Ativar**

### Verificar Regras:

1. Aba **"Regras"** (Rules)
2. Você verá as regras padrão
3. ⚠️ **NÃO publique ainda** - vamos fazer via CLI

---

## 4️⃣ CONFIGURAR STORAGE

### Criar Storage:

1. No menu lateral, clique em **"Storage"**
2. **Começar** / "Get started"
3. **Regras de segurança:**
   - Escolha: **"Modo de produção"**
4. **Localização:**
   - Mesma do Firestore: `southamerica-east1`
5. **Concluir**

### Verificar Regras:

1. Aba **"Regras"** (Rules)
2. ⚠️ **NÃO publique ainda** - vamos fazer via CLI

---

## 5️⃣ OBTER CREDENCIAIS

### Adicionar App Web:

1. **Volte para:** Project Overview (ícone ⚙️)
2. **Clique em:** `</>` (Web)
3. **Apelido do app:** `Limpix Web`
4. ❌ **NÃO** marcar "Firebase Hosting"
5. **Registrar app**

### Copiar Credenciais:

Você verá algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "limpix-xxxxx.firebaseapp.com",
  projectId: "limpix-xxxxx",
  storageBucket: "limpix-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

⚠️ **COPIE TUDO!**

---

## 6️⃣ CONFIGURAR NO PROJETO

### 1. Instalar Dependências:

```bash
# Windows
firebase-install.bat

# Linux/Mac
./firebase-install.sh

# Ou manualmente:
npm install firebase
npm install -g firebase-tools
```

### 2. Colar Credenciais:

Abra: `src/config/firebase.config.ts`

Substitua:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // ← SUAS CREDENCIAIS AQUI
  authDomain: "limpix-xxxxx.firebaseapp.com",
  projectId: "limpix-xxxxx",
  storageBucket: "limpix-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 3. Verificar Instalação:

```bash
npm start
```

Console deve mostrar:
```
🔥 Firebase initialized: YES
```

---

## 7️⃣ DEPLOY DAS REGRAS

### Login no Firebase:

```bash
firebase login
```

- Abrirá navegador
- Faça login com sua conta Google
- Permita acesso

### Selecionar Projeto:

```bash
firebase use --add
```

- Selecione: `limpix-xxxxx` (seu projeto)
- Alias: `default`

### Deploy Firestore Rules:

```bash
firebase deploy --only firestore:rules
```

✅ Resultado:
```
✔  Deploy complete!
```

### Deploy Firestore Indexes:

```bash
firebase deploy --only firestore:indexes
```

### Deploy Storage Rules:

```bash
firebase deploy --only storage
```

### Deploy Tudo:

```bash
firebase deploy
```

---

## 8️⃣ TESTAR LOCALMENTE

### Iniciar Emuladores (Opcional):

```bash
firebase emulators:start
```

Abrirá:
- 🌐 UI: http://localhost:4000
- 🔐 Auth: http://localhost:9099
- 💾 Firestore: http://localhost:8080
- 📦 Storage: http://localhost:9199

### Usar Emuladores no App:

Em `src/config/firebase.config.ts`, adicione (apenas dev):

```typescript
// APENAS PARA DESENVOLVIMENTO LOCAL
if (__DEV__) {
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## ✅ CHECKLIST FINAL

```markdown
Configuração Firebase:
- [ ] Projeto criado
- [ ] Authentication ativado (Email/Password)
- [ ] Firestore Database criado
- [ ] Storage criado
- [ ] Credenciais copiadas

Projeto Local:
- [ ] firebase instalado (npm install firebase)
- [ ] firebase-tools instalado (npm install -g firebase-tools)
- [ ] Credenciais coladas em firebase.config.ts
- [ ] firebase login executado
- [ ] firebase use --add executado

Deploy:
- [ ] Firestore rules deployed
- [ ] Firestore indexes deployed
- [ ] Storage rules deployed

Testes:
- [ ] App inicia sem erros
- [ ] Console mostra "🔥 Firebase initialized: YES"
- [ ] Cadastro funciona
- [ ] Login funciona
```

---

## 🎯 PRÓXIMOS PASSOS

### 1. Migrar App.tsx para Firebase:

Substituir:
```typescript
import { AuthProvider } from './src/context/AuthContext';
```

Por:
```typescript
import { AuthProviderFirebase } from './src/context/AuthContextFirebase';
```

E no render:
```tsx
<AuthProviderFirebase>
  <AppNavigator />
</AuthProviderFirebase>
```

### 2. Migrar Telas:

Substituir em todas as telas:
```typescript
import { useAuth } from '../context/AuthContext';
```

Por:
```typescript
import { useAuthFirebase as useAuth } from '../context/AuthContextFirebase';
```

### 3. Migrar Database Calls:

Substituir:
```typescript
import { getProviders } from '../services/database';
```

Por:
```typescript
import { getProvidersFirestore as getProviders } from '../services/firebaseDatabase';
```

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Firebase not configured"

**Solução:** Verifique se colou as credenciais corretamente

### Erro: "Missing or insufficient permissions"

**Solução:** Deploy das regras:
```bash
firebase deploy --only firestore:rules
```

### Erro: "Network request failed"

**Solução:** 
- Verifique internet
- Verifique se o projeto existe no console

### Erro: "API key not valid"

**Solução:**
- Copie as credenciais novamente
- Verifique se não há espaços extras

---

## 💰 CUSTOS

### Plano Spark (Grátis):

| Recurso | Limite Grátis |
|---------|---------------|
| **Authentication** | Ilimitado ✅ |
| **Firestore** | 1GB storage, 50K reads/dia |
| **Storage** | 5GB storage, 1GB/dia downloads |
| **Cloud Functions** | 125K invocações/mês |

### Quando Escalar:

- **Blaze Plan** (Pay as you go)
- Preço por uso adicional
- ~$25-50/mês para app médio

---

## 📞 SUPORTE

### Documentação Oficial:
- Firebase: https://firebase.google.com/docs
- React Native Firebase: https://rnfirebase.io

### Console:
- https://console.firebase.google.com

### Status:
- https://status.firebase.google.com

---

## 🎉 PRONTO!

Seu app agora está conectado ao Firebase! 🚀

**Próximo passo:** Testar cadastro e login no app

```bash
npm start
```

---

**Criado por:** GitHub Copilot  
**Data:** Janeiro 2025
