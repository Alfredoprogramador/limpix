# 🏠 Limpix - Aplicativo de Serviços Domésticos

Aplicativo mobile para conectar clientes a prestadores de serviços domésticos como limpeza, pintura, pedreiro, encanador, eletricista, estofado e montador de móveis.

## 🚀 Tecnologias

- **React Native** 0.76.5
- **Expo** SDK 54
- **TypeScript** 5.3.3
- **React Navigation** 7.x
- **Expo SQLite** (banco de dados local)
- **AsyncStorage** (persistência de dados)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo Go app no celular (opcional)
- Android Studio (para emulador Android)
- Xcode (para emulador iOS - apenas macOS)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd Clean_Limpeça
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm start
# ou
npx expo start
```

### 4. Escolha a plataforma
- Pressione `a` para Android
- Pressione `i` para iOS (apenas macOS)
- Pressione `w` para Web
- Escaneie o QR Code com Expo Go app

## 📱 Funcionalidades

### Para Clientes
- ✅ Cadastro e login
- ✅ Busca de prestadores por categoria
- ✅ Visualização de perfil do prestador
- ✅ Agendamento de serviços
- ✅ Histórico de agendamentos
- ✅ Avaliação de serviços
- ✅ Contato via WhatsApp, E-mail e Mapa

### Para Prestadores
- ✅ Cadastro e login
- ✅ Dashboard com visão geral
- ✅ Gerenciamento de agenda
- ✅ Perfil editável
- ✅ Visualização de agendamentos

## 🗂️ Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── constants/        # Constantes (cores, serviços)
├── context/          # Context API (autenticação)
├── navigation/       # Configuração de navegação
├── screens/          # Telas do aplicativo
│   ├── auth/         # Login e registro
│   ├── client/       # Telas do cliente
│   ├── provider/     # Telas do prestador
│   └── shared/       # Telas compartilhadas
├── services/         # Serviços (banco de dados)
├── types/            # Tipos TypeScript
└── utils/            # Utilitários (validação)
```

## 🔐 Autenticação

⚠️ **AVISO DE SEGURANÇA**: Este projeto usa autenticação local com SQLite e AsyncStorage apenas para demonstração. 

**EM PRODUÇÃO, VOCÊ DEVE:**
- Implementar backend real (Firebase, Supabase, etc.)
- Usar autenticação JWT ou OAuth
- Nunca armazenar senhas localmente
- Implementar HTTPS em todas as requisições

## 🎨 Personalização

### Cores
Edite `src/constants/colors.ts`:
```typescript
export const COLORS = {
  primary: '#1565C0',
  secondary: '#FF8F00',
  // ...
};
```

### Serviços
Edite `src/constants/services.ts` para adicionar/remover categorias.

## 🧪 Testes

```bash
# Executar testes (quando implementado)
npm test
```

## 📦 Build para Produção

### Android (APK)
```bash
npx eas build --platform android --profile preview
```

### iOS (IPA)
```bash
npx eas build --platform ios --profile preview
```

### Web
```bash
npm run web
```

## 🐛 Problemas Conhecidos

1. **React 19 incompatibilidade**: Revertido para React 18.3.1
2. **SQLite async**: Usar `await` em todas as operações DB
3. **Validação de data**: Implementada validação manual (considere usar date picker)

## 📝 TODO

- [ ] Implementar backend real
- [ ] Adicionar date picker nativo
- [ ] Implementar testes unitários
- [ ] Adicionar mapa com geolocalização
- [ ] Implementar notificações push
- [ ] Adicionar sistema de pagamento
- [ ] Implementar chat entre cliente e prestador
- [ ] Adicionar fotos de perfil e portfolio

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando React Native + Expo

## 📞 Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato via e-mail

---

**Última atualização:** Janeiro 2025
