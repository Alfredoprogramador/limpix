# 🧪 PLANO DE TESTES - LIMPIX

## 📊 OVERVIEW

Este documento contém todos os cenários de teste para o app Limpix.

---

## 🎯 CENÁRIOS DE TESTE

### 1. AUTENTICAÇÃO 🔐

#### 1.1 Cadastro de Cliente
**Objetivo:** Verificar criação de conta cliente

**Passos:**
1. Abrir app
2. Tela de Login → "Cadastrar como Cliente"
3. Preencher formulário:
   - Nome: "João Silva"
   - E-mail: "joao@test.com"
   - Telefone: "(11) 99999-0001"
   - Senha: "123456"
   - Confirmar senha: "123456"
4. Clicar "Criar Conta"

**Resultado Esperado:**
- ✅ Usuário criado
- ✅ Redirecionado para tela Home
- ✅ Ver nome no header

**Resultado SQLite:**
- ✅ Registro em `users` table

**Resultado Firebase:**
- ✅ Usuário em Authentication
- ✅ Documento em `users` collection

---

#### 1.2 Cadastro de Prestador
**Objetivo:** Verificar criação de conta prestador

**Passos:**
1. Tela de Login → "Cadastrar como Prestador"
2. Preencher formulário:
   - Nome: "Maria Santos"
   - E-mail: "maria@test.com"
   - Telefone: "(11) 99999-0002"
   - Cidade: "São Paulo"
   - Bairro: "Vila Madalena"
   - Descrição: "Profissional de limpeza"
   - Preço: "R$ 80 - R$ 150"
   - Senha: "123456"
3. Clicar "Cadastrar"

**Resultado Esperado:**
- ✅ Conta criada
- ✅ Redirecionado para Dashboard
- ✅ Ver nome no perfil

**Resultado SQLite:**
- ✅ Registro em `users` e `providers` tables

**Resultado Firebase:**
- ✅ Usuário em Authentication
- ✅ Documentos em `users` e `providers` collections

---

#### 1.3 Login com E-mail Válido
**Objetivo:** Login com credenciais corretas

**Passos:**
1. Tela de Login
2. E-mail: "joao@test.com"
3. Senha: "123456"
4. Clicar "Entrar"

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionado para Home

---

#### 1.4 Login com E-mail Inválido
**Objetivo:** Validar e-mail

**Passos:**
1. E-mail: "emailinvalido"
2. Senha: "123456"
3. Clicar "Entrar"

**Resultado Esperado:**
- ❌ Erro: "Por favor, insira um e-mail válido."

---

#### 1.5 Login com Senha Errada
**Objetivo:** Verificar segurança

**Passos:**
1. E-mail: "joao@test.com"
2. Senha: "senhaerrada"
3. Clicar "Entrar"

**Resultado Esperado:**
- ❌ Erro: "Senha incorreta."

---

#### 1.6 Logout
**Objetivo:** Deslogar

**Passos:**
1. Logado → Aba "Perfil"
2. Clicar "Sair"

**Resultado Esperado:**
- ✅ Deslogado
- ✅ Volta para tela Login

---

### 2. BUSCA DE PRESTADORES 🔍

#### 2.1 Listar Categorias
**Objetivo:** Ver todas as categorias

**Passos:**
1. Login como cliente
2. Tela Home

**Resultado Esperado:**
- ✅ Ver 7 categorias:
  - 🧹 Limpeza
  - 🎨 Pintura
  - 🧱 Pedreiro
  - 🔧 Encanador
  - ⚡ Eletricista
  - 🛋️ Estofado
  - 🪛 Montador de Móveis

---

#### 2.2 Buscar Prestadores por Categoria
**Objetivo:** Filtrar prestadores

**Passos:**
1. Tela Home
2. Clicar em "Limpeza"

**Resultado Esperado:**
- ✅ Lista de prestadores de limpeza
- ✅ Ver nome, rating, localização, preço
- ✅ Badge "Disponível" ou "Ocupado"

---

#### 2.3 Buscar por Nome
**Objetivo:** Pesquisar prestador específico

**Passos:**
1. Na lista de prestadores
2. Campo de busca: "Maria"

**Resultado Esperado:**
- ✅ Filtrar resultados por nome
- ✅ Ver apenas "Maria Silva"

---

#### 2.4 Buscar por Cidade
**Objetivo:** Filtrar por localização

**Passos:**
1. Campo de busca: "São Paulo"

**Resultado Esperado:**
- ✅ Mostrar todos de São Paulo

---

#### 2.5 Sem Resultados
**Objetivo:** Mensagem quando não há prestadores

**Passos:**
1. Buscar: "XYZ123"

**Resultado Esperado:**
- ✅ "Nenhum prestador encontrado."
- ✅ Hint: "Tente buscar em outra cidade ou bairro."

---

### 3. PERFIL DO PRESTADOR 👤

#### 3.1 Ver Perfil Completo
**Objetivo:** Visualizar dados do prestador

**Passos:**
1. Lista de prestadores
2. Clicar em um prestador

**Resultado Esperado:**
- ✅ Avatar com inicial
- ✅ Nome
- ✅ Localização
- ✅ Rating + número de avaliações
- ✅ Badge disponibilidade
- ✅ Descrição
- ✅ Faixa de preço
- ✅ Serviços oferecidos (chips)
- ✅ Botões de contato (WhatsApp, E-mail, Mapa)

---

#### 3.2 Abrir WhatsApp
**Objetivo:** Contato direto

**Passos:**
1. Perfil do prestador
2. Clicar "WhatsApp"

**Resultado Esperado:**
- ✅ Abrir WhatsApp (se instalado)
- ✅ Mensagem pré-preenchida

---

#### 3.3 Abrir E-mail
**Objetivo:** Enviar e-mail

**Passos:**
1. Clicar "E-mail"

**Resultado Esperado:**
- ✅ Abrir app de e-mail
- ✅ Assunto e corpo pré-preenchidos

---

#### 3.4 Abrir Mapa
**Objetivo:** Ver localização

**Passos:**
1. Clicar "Mapa"

**Resultado Esperado:**
- ✅ Abrir Google Maps
- ✅ Mostrar endereço

---

#### 3.5 Ver Avaliações
**Objetivo:** Ler reviews

**Passos:**
1. Scroll até "Avaliações"

**Resultado Esperado:**
- ✅ Lista de avaliações
- ✅ Nome do cliente
- ✅ Rating (estrelas)
- ✅ Comentário
- ✅ Data

---

### 4. AGENDAMENTO 📅

#### 4.1 Criar Agendamento
**Objetivo:** Agendar serviço

**Passos:**
1. Perfil do prestador
2. Clicar "Agendar Serviço"
3. Preencher:
   - Data: "2025-06-15"
   - Horário: "09:00"
   - Endereço: "Rua Teste, 123"
   - Cidade: "São Paulo"
   - Observações: "Trazer produtos"
4. Clicar "Confirmar Agendamento"

**Resultado Esperado:**
- ✅ Alerta: "✅ Agendamento realizado!"
- ✅ Voltar para Home

**Resultado SQLite:**
- ✅ Registro em `bookings` table
- ✅ Status: "pendente"

**Resultado Firebase:**
- ✅ Documento em `bookings` collection

---

#### 4.2 Data Inválida
**Objetivo:** Validar formato

**Passos:**
1. Data: "15/06/2025" (formato errado)
2. Tentar agendar

**Resultado Esperado:**
- ❌ Erro: "Formato de data inválido. Use AAAA-MM-DD"

---

#### 4.3 Data Passada
**Objetivo:** Não permitir datas antigas

**Passos:**
1. Data: "2020-01-01"
2. Tentar agendar

**Resultado Esperado:**
- ❌ Erro: "A data deve ser hoje ou no futuro."

---

#### 4.4 Campos Obrigatórios
**Objetivo:** Validar formulário

**Passos:**
1. Deixar campo "Endereço" vazio
2. Tentar agendar

**Resultado Esperado:**
- ❌ Erro: "Informe o endereço."

---

### 5. HISTÓRICO 📋

#### 5.1 Ver Todos os Agendamentos
**Objetivo:** Listar bookings

**Passos:**
1. Aba "Histórico"

**Resultado Esperado:**
- ✅ Lista de agendamentos
- ✅ Ordenados por data (mais recente primeiro)
- ✅ Cada card mostra:
  - Ícone do serviço
  - Nome do prestador
  - Data e hora
  - Endereço
  - Status (badge colorido)

---

#### 5.2 Filtrar por Status
**Objetivo:** Filtrar agendamentos

**Passos:**
1. Aba "Histórico"
2. Clicar filtro "Pendente"

**Resultado Esperado:**
- ✅ Mostrar apenas pendentes
- ✅ Chip "Pendente" destacado

---

#### 5.3 Cancelar Agendamento
**Objetivo:** Cancelar booking

**Passos:**
1. Agendamento "Pendente"
2. Clicar "Cancelar"
3. Confirmar

**Resultado Esperado:**
- ✅ Status muda para "Cancelado"
- ✅ Badge vermelho
- ✅ Botão "Cancelar" some

---

#### 5.4 Histórico Vazio
**Objetivo:** Mensagem quando sem agendamentos

**Passos:**
1. Usuário novo
2. Aba "Histórico"

**Resultado Esperado:**
- ✅ Emoji 📋
- ✅ "Sem agendamentos"
- ✅ "Seus agendamentos aparecerão aqui."

---

### 6. AVALIAÇÕES ⭐

#### 6.1 Avaliar Serviço Concluído
**Objetivo:** Criar review

**Passos:**
1. Histórico → Agendamento "Concluído"
2. Clicar "⭐ Avaliar"
3. Selecionar 5 estrelas
4. Comentário: "Excelente serviço!"
5. Clicar "Enviar Avaliação"

**Resultado Esperado:**
- ✅ Alerta: "✅ Avaliação enviada!"
- ✅ Voltar para Histórico
- ✅ Botão "Avaliar" desaparece

**Resultado SQLite:**
- ✅ Registro em `reviews` table
- ✅ Rating do prestador atualizado

**Resultado Firebase:**
- ✅ Documento em `reviews` collection
- ✅ Provider rating/reviewCount atualizado

---

#### 6.2 Avaliar Duas Vezes (Não Permitido)
**Objetivo:** Impedir duplicatas

**Passos:**
1. Serviço já avaliado
2. Tentar avaliar novamente

**Resultado Esperado:**
- ❌ Alerta: "Você já avaliou este serviço."

---

#### 6.3 Avaliação sem Estrelas
**Objetivo:** Validar rating

**Passos:**
1. Tela de avaliação
2. Não selecionar estrelas
3. Tentar enviar

**Resultado Esperado:**
- ❌ Erro: "Selecione uma avaliação de 1 a 5 estrelas."

---

### 7. PERFIL CLIENTE 👤

#### 7.1 Ver Perfil
**Objetivo:** Visualizar dados

**Passos:**
1. Aba "Perfil"

**Resultado Esperado:**
- ✅ Avatar com inicial
- ✅ Nome
- ✅ E-mail
- ✅ Telefone
- ✅ Endereço (se cadastrado)
- ✅ Botão "Sair"

---

#### 7.2 Editar Perfil
**Objetivo:** Atualizar dados

**Passos:**
1. Aba "Perfil"
2. Botão "Editar" (se implementado)
3. Mudar nome para "João Silva Jr."
4. Salvar

**Resultado Esperado:**
- ✅ Dados atualizados
- ✅ Ver novo nome no header

---

### 8. PRESTADOR - DASHBOARD 📊

#### 8.1 Ver Dashboard
**Objetivo:** Visualizar métricas

**Passos:**
1. Login como prestador
2. Aba "Dashboard"

**Resultado Esperado:**
- ✅ Estatísticas:
  - Total de agendamentos
  - Avaliação média
  - Agendamentos pendentes
- ✅ Lista de próximos agendamentos

---

#### 8.2 Ver Agenda
**Objetivo:** Listar bookings

**Passos:**
1. Aba "Agenda"

**Resultado Esperado:**
- ✅ Lista de agendamentos
- ✅ Ordenados por data
- ✅ Filtros de status

---

#### 8.3 Confirmar Agendamento
**Objetivo:** Aceitar booking

**Passos:**
1. Agendamento "Pendente"
2. Clicar "Confirmar"

**Resultado Esperado:**
- ✅ Status → "Confirmado"
- ✅ Badge azul

---

#### 8.4 Concluir Serviço
**Objetivo:** Finalizar booking

**Passos:**
1. Agendamento "Confirmado"
2. Clicar "Concluir"

**Resultado Esperado:**
- ✅ Status → "Concluído"
- ✅ Badge verde

---

#### 8.5 Editar Perfil Prestador
**Objetivo:** Atualizar dados

**Passos:**
1. Aba "Perfil"
2. Editar:
   - Descrição
   - Serviços oferecidos
   - Disponibilidade
   - Faixa de preço
3. Salvar

**Resultado Esperado:**
- ✅ Dados atualizados
- ✅ Refletir na busca

---

### 9. PERFORMANCE ⚡

#### 9.1 Tempo de Inicialização
**Objetivo:** App inicia rápido

**Métrica:**
- ✅ < 3 segundos em modo development
- ✅ < 1 segundo em produção

---

#### 9.2 Lista de Prestadores
**Objetivo:** Scroll suave

**Passos:**
1. Lista com 100+ prestadores
2. Scroll rápido

**Resultado Esperado:**
- ✅ FPS > 55
- ✅ Sem travamentos

---

#### 9.3 Busca em Tempo Real
**Objetivo:** Filtro rápido

**Passos:**
1. Digitar na busca: "Maria"

**Resultado Esperado:**
- ✅ Resultados aparecem instantaneamente
- ✅ Sem delay perceptível

---

### 10. OFFLINE (Se implementado) 📴

#### 10.1 Modo Offline
**Objetivo:** Funcionar sem internet

**Passos:**
1. Desativar Wi-Fi e dados móveis
2. Abrir app

**Resultado Esperado (SQLite):**
- ✅ App funciona normalmente
- ✅ Ver dados em cache

**Resultado Esperado (Firebase):**
- ⚠️ Erro: "Sem conexão"
- ✅ Offline persistence (se habilitado)

---

## 📊 CHECKLIST DE TESTES

### Autenticação:
- [ ] Cadastro cliente
- [ ] Cadastro prestador
- [ ] Login válido
- [ ] Login inválido
- [ ] Logout

### Busca:
- [ ] Listar categorias
- [ ] Buscar por categoria
- [ ] Buscar por nome
- [ ] Buscar por cidade
- [ ] Sem resultados

### Perfil Prestador:
- [ ] Ver perfil
- [ ] WhatsApp
- [ ] E-mail
- [ ] Mapa
- [ ] Avaliações

### Agendamento:
- [ ] Criar agendamento
- [ ] Data inválida
- [ ] Data passada
- [ ] Campos obrigatórios

### Histórico:
- [ ] Ver todos
- [ ] Filtrar status
- [ ] Cancelar
- [ ] Vazio

### Avaliações:
- [ ] Criar review
- [ ] Não duplicar
- [ ] Validar estrelas

### Prestador:
- [ ] Dashboard
- [ ] Agenda
- [ ] Confirmar
- [ ] Concluir
- [ ] Editar perfil

### Performance:
- [ ] Inicialização < 3s
- [ ] Scroll suave
- [ ] Busca rápida

---

## 🐛 BUGS CONHECIDOS

### SQLite:
1. ❌ Senhas hasheadas localmente (inseguro)
2. ⚠️ Sem sincronização multi-dispositivo

### Firebase:
1. ⚠️ Requer internet constante
2. ⚠️ Cold start mais lento

---

## 📝 RELATÓRIO DE TESTE

### Modelo de Relatório:

```markdown
# RELATÓRIO DE TESTE - [DATA]

## Ambiente:
- Plataforma: Android / iOS / Web
- Versão: 1.0.0
- Database: SQLite / Firebase
- Device: Samsung Galaxy S21 / iPhone 13 / Chrome

## Resultados:

### ✅ PASSOU:
1. Login com credenciais válidas
2. Busca de prestadores
3. ...

### ❌ FALHOU:
1. Cadastro travando no campo X
   - Erro: "TypeError: undefined"
   - Steps to reproduce: ...

### ⚠️ WARNINGS:
1. Performance ruim em lista grande
   - FPS: 30 (esperado: 55)

## Screenshots:
[Anexar aqui]

## Notas:
- Tempo total de teste: 2 horas
- Cenários testados: 35/50
```

---

## 🎯 PRIORIDADE DE TESTES

### 🔴 P0 - Crítico (testar primeiro):
1. Cadastro
2. Login
3. Buscar prestadores
4. Criar agendamento

### 🟡 P1 - Alto:
1. Perfil prestador
2. Histórico
3. Avaliações
4. Dashboard prestador

### 🟢 P2 - Médio:
1. Filtros
2. Busca por texto
3. Editar perfil

### ⚪ P3 - Baixo:
1. Performance
2. Offline mode
3. Animações

---

**Total de Cenários:** 50+  
**Tempo Estimado:** 4-6 horas

**Criado por:** GitHub Copilot  
**Data:** Janeiro 2025
