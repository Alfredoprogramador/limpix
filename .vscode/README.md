# Configuração do VS Code para Limpix

## Extensões Recomendadas

Ao abrir o projeto no VS Code, você verá uma notificação para instalar as extensões recomendadas. Clique em **"Instalar Tudo"**.

As extensões incluem:
- **ESLint** - Análise de código
- **Prettier** - Formatação automática
- **React Native Tools** - Suporte para React Native
- **ES7+ React/Redux snippets** - Snippets úteis
- **Expo Tools** - Ferramentas Expo integradas

## Como Executar o Projeto

### Opção 1: Usando o Terminal Integrado (Ctrl + `)

```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar o projeto
npm start

# Ou iniciar diretamente em uma plataforma específica:
npm run web      # Navegador web
npm run android  # Android (requer emulador ou dispositivo)
npm run ios      # iOS (requer macOS e Xcode)
```

### Opção 2: Usando Debug/Run (F5)

1. Pressione `Ctrl + Shift + D` para abrir o painel de Debug
2. Selecione uma das configurações:
   - **Expo: Start** - Inicia o Metro Bundler
   - **Expo: Start Web** - Inicia no navegador
   - **Expo: Start Android** - Inicia no Android
   - **Expo: Start iOS** - Inicia no iOS
3. Pressione `F5` ou clique no botão ▶️ verde

### Opção 3: Usando Tasks (Ctrl + Shift + P)

1. Pressione `Ctrl + Shift + P`
2. Digite "Tasks: Run Task"
3. Selecione uma das tasks disponíveis

## Atalhos Úteis do VS Code

- `Ctrl + Shift + P` - Command Palette
- `Ctrl + P` - Buscar arquivos rapidamente
- `Ctrl + Shift + F` - Buscar em todos os arquivos
- `Ctrl + Shift + E` - Explorer de arquivos
- `Ctrl + ` ` - Terminal integrado
- `Ctrl + B` - Toggle sidebar
- `Shift + Alt + F` - Formatar documento
- `F12` - Ir para definição
- `Ctrl + Click` - Ir para definição
- `Shift + F12` - Mostrar todas as referências
- `F2` - Renomear símbolo

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas da aplicação
│   ├── auth/       # Telas de autenticação
│   ├── client/     # Telas do cliente
│   └── provider/   # Telas do prestador
├── services/       # Serviços (banco de dados, etc)
├── types/          # Tipos TypeScript
├── constants/      # Constantes e configurações
└── navigation/     # Configuração de navegação
```

## Resolução de Problemas

### TypeScript não reconhece os tipos

1. Reinicie o servidor TypeScript:
   - `Ctrl + Shift + P`
   - Digite "TypeScript: Restart TS Server"

### Cache do Expo com problemas

Execute no terminal:
```bash
npx expo start -c
```

### Problemas com node_modules

```bash
# Remover e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Dicas de Produtividade

1. **Auto-save**: Ative salvamento automático em `File > Auto Save`
2. **Format on Save**: Já está configurado para formatar ao salvar
3. **Imports automáticos**: TypeScript importará automaticamente ao usar símbolos
4. **Snippets React Native**: 
   - Digite `rnf` + Tab para criar um componente funcional
   - Digite `rnfe` + Tab para criar e exportar
   - Digite `useS` + Tab para useState

## Links Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [VS Code React Native](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)
