# Limpix 🏠

**Aplicativo de serviços domésticos** – limpeza, pintura, pedreiro, encanador, eletricista, estofado e montador de móveis.

---

## ✨ Funcionalidades

### Para Clientes 👤
- **Cadastro e login** com perfil de cliente
- **Busca por categoria** de serviço: limpeza, pintura, pedreiro, encanador, eletricista, estofado
- **Perfil do prestador** com avaliações, serviços e localização
- **Agendamento** com escolha de data, horário, endereço e observações
- **Histórico de agendamentos** com filtros por status
- **Avaliações** (1–5 estrelas + comentário) após serviço concluído
- **Contato via WhatsApp** com mensagem pré-preenchida
- **Contato via E-mail** com assunto e corpo pré-preenchidos
- **Mapa** para ver endereço do prestador no app de mapas nativo

### Para Prestadores de Serviço 🛠️
- **Cadastro e login** com perfil de prestador
- **Painel de agendamentos** pendentes e confirmados
- **Confirmar / Concluir / Cancelar** agendamentos
- **Agenda completa** com histórico de todos os serviços
- **Edição de perfil**: serviços oferecidos, cidade, bairro, descrição, faixa de preço
- **Toggle de disponibilidade** (Disponível / Ocupado)
- **Avaliação média** atualizada automaticamente após cada review

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native + Expo SDK 54 |
| Linguagem | TypeScript |
| Banco de dados | expo-sqlite (SQLite local) |
| Autenticação | AsyncStorage + SHA-256 (expo-crypto) |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Mapas | Deep link nativo (Google Maps / Apple Maps) |
| WhatsApp | wa.me deep link |
| Email | mailto deep link |

---

## 📱 Categorias de Serviço

| Emoji | Serviço | Descrição |
|-------|---------|-----------|
| 🧹 | Limpeza | Limpeza residencial e comercial, faxina, higienização |
| 🎨 | Pintura | Pintura de paredes, tetos, fachadas e móveis |
| 🧱 | Pedreiro | Alvenaria, reforma, construção e reparos em geral |
| 🔧 | Encanador | Instalação e reparo de encanamentos e vazamentos |
| ⚡ | Eletricista | Instalações elétricas, disjuntores, tomadas e iluminação |
| 🛋️ | Estofado | Higienização e reforma de sofás, colchões e cadeiras |
| 🪛 | Montador de Móveis | Montagem e desmontagem de móveis residenciais e comerciais |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo Go app no celular (ou emulador Android/iOS)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS).

### Web (preview)
```bash
npx expo start --web
```

---

## 📁 Estrutura do Projeto

```
limpix/
├── App.tsx                    # Entry point com inicialização do banco
├── src/
│   ├── types/                 # Tipos TypeScript (User, Booking, Review, etc.)
│   ├── constants/             # Cores e configurações de serviços
│   ├── context/               # AuthContext (estado de autenticação)
│   ├── services/              # database.ts (SQLite CRUD)
│   ├── navigation/            # AppNavigator, ClientNavigator, ProviderNavigator
│   ├── components/            # ServiceCard, ProviderCard, StarRating, BookingCard
│   └── screens/
│       ├── auth/              # LoginScreen, RegisterScreen
│       ├── client/            # Home, ProviderList, ProviderProfile, Booking, History, Review
│       ├── provider/          # Dashboard, Schedule, ProfileEdit
│       └── shared/            # ProfileScreen (cliente)
└── assets/                    # Ícones e imagens do app
```

---

## 🔐 Notas de Segurança

> **Demo App**: A autenticação é feita localmente com senhas hasheadas via SHA-256 (expo-crypto).  
> Em produção, use um serviço de autenticação backend (Firebase Auth, Supabase, etc.).

---

*Desenvolvido com ❤️ para o projeto Limpix*
