# 🔄 GUIA DE MIGRAÇÃO: SQLite → Firebase

## 📊 COMPARAÇÃO

| Recurso | SQLite (Atual) | Firebase (Novo) |
|---------|----------------|-----------------|
| **Auth** | Local (inseguro) | Firebase Auth ✅ |
| **Database** | SQLite local | Firestore (cloud) ✅ |
| **Storage** | Não tem | Firebase Storage ✅ |
| **Real-time** | Não | Sim ✅ |
| **Backup** | Manual | Automático ✅ |
| **Multi-device** | Não | Sim ✅ |

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### Opção 1: Migração Gradual (Recomendado) ✅

**Vantagem:** Pode testar Firebase sem quebrar app atual

```typescript
// Usar feature flag
const USE_FIREBASE = __DEV__; // ou true para produção

export const database = USE_FIREBASE 
  ? firebaseDatabaseService 
  : sqliteService;
```

### Opção 2: Migração Completa

**Vantagem:** Código mais limpo  
**Desvantagem:** Precisa testar tudo de uma vez

---

## 📝 PASSO A PASSO

### ETAPA 1: Configurar Firebase ✅ (JÁ FEITO)

- [x] Instalar Firebase SDK
- [x] Criar firebase.config.ts
- [x] Criar firebaseAuth.ts
- [x] Criar firebaseDatabase.ts
- [x] Criar firebaseStorage.ts
- [x] Criar AuthContextFirebase.tsx
- [x] Configurar regras de segurança

### ETAPA 2: Migrar App.tsx

**Arquivo:** `App.tsx`

**ANTES:**
```typescript
import { AuthProvider } from './src/context/AuthContext';

// ...

<AuthProvider>
  <AppNavigator />
</AuthProvider>
```

**DEPOIS:**
```typescript
import { AuthProviderFirebase } from './src/context/AuthContextFirebase';

// ...

<AuthProviderFirebase>
  <AppNavigator />
</AuthProviderFirebase>
```

---

### ETAPA 3: Migrar LoginScreen

**Arquivo:** `src/screens/auth/LoginScreen.tsx`

**ANTES:**
```typescript
import { useAuth } from '../../context/AuthContext';
```

**DEPOIS:**
```typescript
import { useAuthFirebase as useAuth } from '../../context/AuthContextFirebase';
```

✅ **VANTAGEM:** Não precisa mudar mais nada! A API é compatível.

---

### ETAPA 4: Migrar RegisterScreen

**Arquivo:** `src/screens/auth/RegisterScreen.tsx`

**Mesma mudança:**
```typescript
import { useAuthFirebase as useAuth } from '../../context/AuthContextFirebase';
```

---

### ETAPA 5: Migrar ClientRegisterScreen

**Arquivo:** `src/screens/auth/ClientRegisterScreen.tsx`

**Mesma mudança:**
```typescript
import { useAuthFirebase as useAuth } from '../../context/AuthContextFirebase';
```

---

### ETAPA 6: Migrar HomeScreen

**Arquivo:** `src/screens/client/HomeScreen.tsx`

**Mesma mudança no import do useAuth**

---

### ETAPA 7: Migrar ProviderListScreen

**Arquivo:** `src/screens/client/ProviderListScreen.tsx`

**ANTES:**
```typescript
import { getProviders } from '../../services/database';
```

**DEPOIS:**
```typescript
import { getProvidersFirestore as getProviders } from '../../services/firebaseDatabase';
```

---

### ETAPA 8: Migrar ProviderProfileScreen

**Arquivo:** `src/screens/client/ProviderProfileScreen.tsx`

**ANTES:**
```typescript
import { getProviderById, getReviewsByProvider } from '../../services/database';
```

**DEPOIS:**
```typescript
import { 
  getProviderDoc as getProviderById,
  getReviewsByProviderFirestore as getReviewsByProvider 
} from '../../services/firebaseDatabase';
```

---

### ETAPA 9: Migrar BookingScreen

**Arquivo:** `src/screens/client/BookingScreen.tsx`

**ANTES:**
```typescript
import { createBooking } from '../../services/database';
```

**DEPOIS:**
```typescript
import { createBookingFirestore as createBooking } from '../../services/firebaseDatabase';
```

**⚠️ ATENÇÃO:** Firebase retorna ID do documento:
```typescript
const bookingId = await createBooking({
  // ... dados
});
```

---

### ETAPA 10: Migrar HistoryScreen

**Arquivo:** `src/screens/client/HistoryScreen.tsx`

**ANTES:**
```typescript
import { 
  getBookingsByClient, 
  updateBookingStatus, 
  getReviewByBooking 
} from '../../services/database';
```

**DEPOIS:**
```typescript
import { 
  getBookingsByClientFirestore as getBookingsByClient,
  updateBookingStatusFirestore as updateBookingStatus,
  getReviewByBookingFirestore as getReviewByBooking
} from '../../services/firebaseDatabase';
```

---

### ETAPA 11: Migrar ReviewScreen

**Arquivo:** `src/screens/client/ReviewScreen.tsx`

**ANTES:**
```typescript
import { createReview } from '../../services/database';
```

**DEPOIS:**
```typescript
import { createReviewFirestore as createReview } from '../../services/firebaseDatabase';
```

---

### ETAPA 12: Migrar Provider Screens

**Mesma lógica para:**
- `ProviderHomeScreen.tsx`
- `ProviderScheduleScreen.tsx`
- `ProviderProfileEditScreen.tsx`

---

## 🔧 UTILITÁRIO DE MIGRAÇÃO

### Script para Migrar Dados (Opcional)

Se quiser migrar dados existentes do SQLite para Firebase:

**Criar:** `scripts/migrate-sqlite-to-firebase.ts`

```typescript
import { initDatabase, getProviders as getSQLiteProviders } from '../src/services/database';
import { createProviderDoc } from '../src/services/firebaseDatabase';

async function migrateSQLiteToFirebase() {
  console.log('🔄 Starting migration...');

  // 1. Init SQLite
  await initDatabase();

  // 2. Get all data
  const providers = await getSQLiteProviders();

  // 3. Upload to Firebase
  for (const provider of providers) {
    try {
      await createProviderDoc(provider.id, provider);
      console.log(`✅ Migrated provider: ${provider.name}`);
    } catch (error) {
      console.error(`❌ Error migrating ${provider.name}:`, error);
    }
  }

  console.log('✅ Migration complete!');
}

migrateSQLiteToFirebase();
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### Autenticação:
- [ ] App.tsx → AuthProviderFirebase
- [ ] LoginScreen → useAuthFirebase
- [ ] RegisterScreen → useAuthFirebase
- [ ] ClientRegisterScreen → useAuthFirebase

### Database Calls:
- [ ] ProviderListScreen → getProvidersFirestore
- [ ] ProviderProfileScreen → firebaseDatabase
- [ ] BookingScreen → createBookingFirestore
- [ ] HistoryScreen → firebaseDatabase
- [ ] ReviewScreen → createReviewFirestore
- [ ] Provider screens → firebaseDatabase

### Testes:
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Busca de prestadores funciona
- [ ] Agendamento funciona
- [ ] Histórico carrega
- [ ] Avaliações funcionam
- [ ] Provider dashboard funciona

---

## 🎯 TESTE RÁPIDO

### 1. Executar App:
```bash
npm start
```

### 2. Testar Fluxo Completo:

```
1. Cadastrar novo cliente
   ↓
2. Buscar prestador
   ↓
3. Agendar serviço
   ↓
4. Ver histórico
   ↓
5. Avaliar serviço
```

### 3. Verificar Firebase Console:

- Authentication → Users (deve ter novo usuário)
- Firestore → Collections (deve ter dados)

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Cannot read property 'uid' of null"

**Causa:** User não está logado  
**Solução:** Verificar onAuthChange listener

### Erro: "Missing or insufficient permissions"

**Causa:** Regras de segurança  
**Solução:** 
```bash
firebase deploy --only firestore:rules
```

### Erro: "Network request failed"

**Causa:** Sem internet ou Firebase mal configurado  
**Solução:** Verificar credenciais

---

## 📊 COMPARAÇÃO DE CÓDIGO

### ANTES (SQLite):
```typescript
// Auth
const result = await login(email, password);

// Database
const providers = await getProviders('limpeza');
await createBooking(bookingData);
```

### DEPOIS (Firebase):
```typescript
// Auth (mesma API!)
const result = await login(email, password);

// Database (apenas nomes diferentes)
const providers = await getProvidersFirestore('limpeza');
const bookingId = await createBookingFirestore(bookingData);
```

---

## 🚀 VANTAGENS APÓS MIGRAÇÃO

### ✅ Segurança:
- Autenticação real (não mais local)
- Senhas hasheadas no servidor
- Regras de segurança granulares

### ✅ Escalabilidade:
- Cloud database (não mais limite local)
- Real-time updates
- Backup automático

### ✅ Features Novas:
- Upload de fotos
- Sync entre dispositivos
- Recuperação de senha
- Social login (futuro)

### ✅ DevOps:
- Logs no Firebase Console
- Analytics automático
- Crash reporting

---

## 💡 DICAS

### 1. Testar em Dev Primeiro:

```typescript
const USE_FIREBASE = __DEV__;
```

### 2. Manter SQLite Temporariamente:

Criar adaptador:
```typescript
export const db = USE_FIREBASE ? firebaseDb : sqliteDb;
```

### 3. Rollback Rápido:

Se algo der errado, basta reverter imports.

---

## 📅 CRONOGRAMA SUGERIDO

### Dia 1: Setup
- [ ] Criar projeto Firebase
- [ ] Configurar credenciais
- [ ] Deploy das regras

### Dia 2: Auth
- [ ] Migrar AuthContext
- [ ] Migrar telas de auth
- [ ] Testar login/cadastro

### Dia 3: Database
- [ ] Migrar chamadas de database
- [ ] Testar todas as funcionalidades
- [ ] Corrigir bugs

### Dia 4: Refinamento
- [ ] Upload de fotos
- [ ] Otimizações
- [ ] Testes finais

---

## ✅ CONCLUSÃO

A migração é **simples** porque mantivemos a **mesma API**.

**Mudanças necessárias:**
1. Trocar imports
2. Configurar Firebase
3. Testar

**Tempo estimado:** 2-4 horas

---

**Boa sorte com a migração! 🚀**
