# 🚀 Guia Rápido - VS Code Setup Completo

## ✅ Configuração Concluída!

O projeto Limpix agora está totalmente configurado para VS Code com:

- ⚙️ Configurações otimizadas para TypeScript e React Native
- 🎯 Launch configurations para debug
- 📋 Tasks pré-configuradas
- 🎨 Prettier para formatação automática
- 📦 Extensões recomendadas
- 🔥 Snippets personalizados para React Native

---

## 📝 Próximos Passos

### 1️⃣ Feche o Visual Studio

Feche o Visual Studio (IDE completo) se ainda estiver aberto.

### 2️⃣ Abra o Projeto no VS Code

```bash
# No terminal PowerShell, navegue até a pasta do projeto:
cd "F:\alfre\Clean_Limpeça"

# Abra o VS Code:
code .
```

Ou simplesmente:
- Abra o VS Code
- File → Open Folder
- Selecione a pasta `F:\alfre\Clean_Limpeça`

### 3️⃣ Instale as Extensões Recomendadas

Quando abrir o projeto, o VS Code mostrará uma notificação:

```
"This workspace has extension recommendations"
```

Clique em **"Install All"** ou **"Show Recommendations"**

**Extensões essenciais:**
- ✅ ESLint
- ✅ Prettier - Code formatter
- ✅ React Native Tools
- ✅ ES7+ React/Redux/React-Native snippets
- ✅ Expo Tools

### 4️⃣ Reinicie o TypeScript Server

Após instalar as extensões:

1. Pressione `Ctrl + Shift + P`
2. Digite: `TypeScript: Restart TS Server`
3. Enter

Isso garantirá que o TypeScript reconheça todas as configurações.

### 5️⃣ Execute o Projeto

**Opção A - Terminal Integrado (Recomendado):**

1. Pressione `Ctrl + `` (Ctrl + backtick) para abrir o terminal
2. Execute:
```bash
npm install    # Primeira vez apenas
npm start      # Inicia o Expo
```

**Opção B - Debug Panel (F5):**

1. Pressione `Ctrl + Shift + D`
2. Selecione "Expo: Start Web" no dropdown
3. Pressione `F5` ou clique no ▶️ verde

---

## 🎯 Atalhos Úteis

| Atalho | Ação |
|--------|------|
| `Ctrl + P` | Busca rápida de arquivos |
| `Ctrl + Shift + F` | Buscar em todo o projeto |
| `Ctrl + Shift + P` | Command Palette |
| `Ctrl + `` | Abrir/fechar terminal |
| `F12` | Ir para definição |
| `Shift + F12` | Ver todas as referências |
| `F2` | Renomear símbolo |
| `Shift + Alt + F` | Formatar documento |
| `Ctrl + /` | Comentar/descomentar |
| `Ctrl + D` | Selecionar próxima ocorrência |
| `Alt + ↑/↓` | Mover linha |
| `Shift + Alt + ↑/↓` | Copiar linha |

---

## 🎨 Snippets Personalizados

Digite o prefixo e pressione `Tab`:

| Prefixo | Descrição |
|---------|-----------|
| `rnfc` | React Native Functional Component completo |
| `rnscreen` | Screen com navigation |
| `ust` | useState hook |
| `uef` | useEffect hook |
| `asfn` | Async function com try-catch |
| `rnss` | StyleSheet.create |
| `clg` | console.log com label |
| `tryc` | try-catch block |

**Exemplo:**
```typescript
// Digite: rnfc + Tab
// Resultado: Um componente funcional completo com TypeScript
```

---

## 🐛 Resolução de Problemas

### ❌ Erro: "Cannot find module '../types'"

**Solução:**
```
Ctrl + Shift + P → TypeScript: Restart TS Server
```

### ❌ Prettier não está formatando

**Solução:**
1. Verifique se a extensão Prettier está instalada
2. `Ctrl + Shift + P` → Format Document
3. Selecione Prettier como formatador padrão

### ❌ Imports não estão auto-completando

**Solução:**
1. Verifique se está usando TypeScript 5.3.3 (workspace version)
2. `Ctrl + Shift + P` → TypeScript: Select TypeScript Version → Use Workspace Version

### ❌ Expo não inicia

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

---

## 📚 Recursos Adicionais

- [📖 README do VS Code](./.vscode/README.md) - Documentação completa
- [🔧 Settings.json](./.vscode/settings.json) - Configurações do editor
- [🚀 Launch.json](./.vscode/launch.json) - Configurações de debug
- [📋 Tasks.json](./.vscode/tasks.json) - Tasks automatizadas

---

## ✨ Dica Final

Configure o **Auto Save** para nunca perder alterações:

```
File → Preferences → Settings
Search: "Auto Save"
Selecione: "afterDelay"
```

---

**Pronto!** 🎉 Seu ambiente está configurado. Boa codificação!

Se tiver dúvidas, consulte o [README completo](./.vscode/README.md).
