# TourFlow - Plano de Testes Completo

## 📋 Índice

1. [Preparação do Ambiente](#preparação-do-ambiente)
2. [Fase 1: Testes de Autenticação](#fase-1-testes-de-autenticação)
3. [Fase 2: Testes do Dashboard (CRUD)](#fase-2-testes-do-dashboard-crud)
4. [Fase 3: Testes do Widget Público](#fase-3-testes-do-widget-público)
5. [Fase 4: Testes de Analytics](#fase-4-testes-de-analytics)
6. [Fase 5: Testes de Segurança (RLS)](#fase-5-testes-de-segurança-rls)
7. [Fase 6: Testes de Edge Cases](#fase-6-testes-de-edge-cases)
8. [Checklist Final](#checklist-final)

---

## Preparação do Ambiente

### Desabilitar Confirmação de Email (Opcional, facilita testes)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard/project/sfokolgauqfppgymcyae/auth/providers)
2. Vá em **Authentication** → **Providers** → **Email**
3. Desabilite **"Confirm email"**
4. Salve as alterações

### Preparar Página de Testes

1. Abra o arquivo `public/test.html`
2. Localize a linha ~180: `const TOUR_ID = 'test-tour-mock';`
3. Após criar um tour no dashboard, substitua pelo ID real
4. Configure `USE_MOCK_DATA = false` para usar dados reais
5. Configure `AUTO_START = true` se quiser que o tour inicie automaticamente

---

## Fase 1: Testes de Autenticação 🔐

### 1.1 Criar Nova Conta

**Passos:**
1. Acesse `http://localhost:8080/`
2. Verifique se a tela de login é exibida
3. Clique em **"Não tem uma conta? Cadastre-se"**
4. Insira email válido (ex: `teste@example.com`)
5. Insira senha com pelo menos 6 caracteres
6. Clique em **"Entrar"**

**Resultado Esperado:**
- ✅ Toast de sucesso: "Conta criada com sucesso!"
- ✅ Redirecionamento automático para o dashboard
- ✅ Email do usuário aparece no header

**Possíveis Problemas:**
- ❌ Se aparecer "Verifique seu email", a confirmação de email está ativada no Supabase
- ❌ Se der erro de RLS, verificar políticas da tabela `tours`

---

### 1.2 Fazer Login

**Passos:**
1. Faça logout (botão "Sair" no header)
2. Insira o email e senha cadastrados
3. Clique em **"Entrar"**

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento para dashboard
- ✅ Lista de tours carrega (vazia inicialmente)

---

### 1.3 Fazer Logout

**Passos:**
1. Clique no botão **"Sair"** no header
2. Verifique redirecionamento

**Resultado Esperado:**
- ✅ Volta para tela de login
- ✅ Não é possível acessar `/` sem autenticação

---

## Fase 2: Testes do Dashboard (CRUD) 📝

### 2.1 Criar Novo Tour

**Passos:**
1. Faça login no dashboard
2. Clique em **"+ New Tour"**
3. Verifique se o editor abre

**Resultado Esperado:**
- ✅ Editor aparece com tour em branco
- ✅ Nome do tour: "Untitled Tour"
- ✅ Switch "Tour Ativo" desativado por padrão
- ✅ Nenhum step criado inicialmente

---

### 2.2 Configurar Tour e Adicionar Steps

**Passos:**
1. Altere o nome para **"Tour de Teste - Completo"**
2. Ative o switch **"Tour Ativo"**
3. Clique em **"Add Step"** 4 vezes
4. Configure cada step:

**Step 1:**
- **Título:** `👋 Bem-vindo!`
- **Conteúdo:** `Este é o primeiro passo do tour`
- **Target:** `#test-heading`
- **Placement:** `bottom`

**Step 2:**
- **Título:** `🎯 Botão Principal`
- **Conteúdo:** `Clique aqui para a ação principal`
- **Target:** `#test-button-1`
- **Placement:** `bottom`

**Step 3:**
- **Título:** `⚙️ Configurações`
- **Conteúdo:** `Acesse as configurações aqui`
- **Target:** `#test-button-3`
- **Placement:** `left`

**Step 4:**
- **Título:** `🎉 Finalizar`
- **Conteúdo:** `Parabéns! Você completou o tour`
- **Target:** `#test-button-4`
- **Placement:** `top`

5. Clique em **"Save"**

**Resultado Esperado:**
- ✅ Toast: "Tour updated successfully!"
- ✅ 4 steps salvos com ordem correta
- ✅ Tour aparece na lista principal

---

### 2.3 Testar Preview no Dashboard

**Passos:**
1. Na lista de tours, selecione o tour criado
2. Clique em **"Preview"** no header
3. Teste navegação:
   - Clique em **"Next"** → avançar steps
   - Clique em **"Back"** → voltar steps
   - Botão "Back" desabilitado no step 1
   - Botão muda para "Done" no último step

**Resultado Esperado:**
- ✅ Modal/overlay aparece com o tour
- ✅ Navegação funciona corretamente
- ✅ Elementos são destacados (se existirem na página de preview)

---

### 2.4 Editar Tour

**Passos:**
1. Selecione um tour da lista
2. Altere o nome ou conteúdo de um step
3. Clique em **"Save"**

**Resultado Esperado:**
- ✅ Alterações são salvas
- ✅ Toast de sucesso aparece
- ✅ Mudanças refletidas na lista

---

### 2.5 Deletar Tour

**Passos:**
1. Clique no ícone de lixeira ao lado de um tour
2. Confirme a exclusão

**Resultado Esperado:**
- ✅ Tour é removido da lista
- ✅ Toast de sucesso aparece
- ✅ Dados são removidos do banco (verificar Supabase)

---

## Fase 3: Testes do Widget Público 🎨

### 3.1 Configurar test.html

**Passos:**
1. Copie o ID do tour criado no dashboard
2. Abra `public/test.html`
3. Na linha ~180, atualize:
   ```javascript
   const TOUR_ID = 'SEU_TOUR_ID_AQUI'; // Cole o ID do tour
   const USE_MOCK_DATA = false; // Usar dados reais
   const AUTO_START = true; // Iniciar automaticamente
   ```
4. Salve o arquivo

---

### 3.2 Testar Carregamento Automático

**Passos:**
1. Abra `http://localhost:8080/test.html` no navegador
2. Abra DevTools (F12) → Console

**Resultado Esperado:**
- ✅ Tour inicia automaticamente
- ✅ Overlay escuro aparece
- ✅ Primeiro step é exibido
- ✅ Elemento `#test-heading` é destacado com spotlight
- ✅ Console mostra logs de inicialização

---

### 3.3 Testar Navegação entre Steps

**Passos:**
1. Clique em **"Next"** → avança para step 2
2. Clique em **"Next"** → avança para step 3
3. Clique em **"Back"** → volta para step 2
4. Observe as mudanças

**Resultado Esperado:**
- ✅ Smooth scroll até o elemento
- ✅ Spotlight muda de elemento
- ✅ Tooltip reposiciona corretamente
- ✅ Counter atualiza (ex: "2 of 4")
- ✅ Progress dots atualizam

---

### 3.4 Testar Conclusão do Tour

**Passos:**
1. Navegue até o último step
2. Botão deve mostrar **"Done"**
3. Clique em **"Done"**

**Resultado Esperado:**
- ✅ Tour desaparece
- ✅ Recarregar página → tour NÃO aparece mais (salvo em localStorage)

---

### 3.5 Testar Reset do Tour

**Passos:**
1. Com o tour concluído, clique em **"Reset Tour"**
2. Recarregue a página

**Resultado Esperado:**
- ✅ Tour aparece novamente
- ✅ LocalStorage foi limpo

---

### 3.6 Testar Skip/Fechar Tour

**Passos:**
1. Inicie o tour
2. Clique no **"X"** no header do tooltip

**Resultado Esperado:**
- ✅ Tour fecha
- ✅ Recarregar → tour aparece de novo (não foi marcado como completo)

---

## Fase 4: Testes de Analytics 📊

### 4.1 Verificar Tracking no DevTools

**Passos:**
1. Abra `test.html` com DevTools aberto
2. Vá para aba **Network**
3. Filtre por `track-event`
4. Inicie o tour e navegue pelos steps

**Resultado Esperado:**
- ✅ Ver chamadas POST para `/track-event` com:
  - `eventType: "view"` (ao iniciar)
  - `eventType: "step_view"` (a cada step)
  - `eventType: "complete"` (ao concluir)
  - `eventType: "skip"` (ao fechar)

---

### 4.2 Verificar Event Log na Página de Testes

**Passos:**
1. Observe o painel **"Event Log"** em `test.html`
2. Navegue pelo tour

**Resultado Esperado:**
- ✅ Eventos aparecem em tempo real
- ✅ Estatísticas são atualizadas (Views, Steps, Completes, Skips)

---

### 4.3 Verificar Dados no Supabase

**Passos:**
1. Abra o [Supabase Dashboard](https://supabase.com/dashboard/project/sfokolgauqfppgymcyae/editor)
2. Vá em **Table Editor** → `tour_analytics`
3. Verifique os registros

**Resultado Esperado:**
- ✅ Ver registros de eventos
- ✅ `tour_id` correto
- ✅ `event_type` variado (view, step_view, complete, skip)
- ✅ `step_index` correto (null para view/complete/skip)
- ✅ `user_identifier` único gerado

---

### 4.4 Visualizar Analytics no Dashboard

**Passos:**
1. Volte ao dashboard TourFlow
2. Selecione o tour testado
3. Clique no ícone de gráfico **"Analytics"**

**Resultado Esperado:**
- ✅ Ver métricas:
  - Total Views
  - Total Completions
  - Total Skipped
  - Completion Rate (%)
- ✅ Gráfico de barras com views por step

---

## Fase 5: Testes de Segurança (RLS) 🔒

### 5.1 Isolamento de Tours entre Usuários

**Passos:**
1. Crie um 2º usuário (nova conta)
2. Faça login com o 2º usuário
3. Verifique a lista de tours

**Resultado Esperado:**
- ✅ NÃO ver tours do 1º usuário
- ✅ Lista vazia ou apenas tours do 2º usuário

---

### 5.2 Analytics Anônimos

**Passos:**
1. Abra `test.html` em uma aba anônima (sem login)
2. Verifique se o widget funciona

**Resultado Esperado:**
- ✅ Widget carrega e funciona normalmente
- ✅ Eventos são registrados no banco
- ✅ `user_identifier` único é gerado

---

### 5.3 Edge Function get-tour

**Passos:**
1. Teste com tour ativo:
   ```
   https://sfokolgauqfppgymcyae.supabase.co/functions/v1/get-tour?tourId={SEU_ID}
   ```
2. Desative o tour no dashboard
3. Teste novamente

**Resultado Esperado:**
- ✅ Retorna tour se `is_active = true`
- ✅ Retorna 404 ou null se `is_active = false`

---

## Fase 6: Testes de Edge Cases ⚠️

### 6.1 Seletor CSS Inválido

**Passos:**
1. Crie um step com target: `.elemento-inexistente`
2. Teste o tour

**Resultado Esperado:**
- ✅ Console warning: "Target element not found"
- ✅ Tooltip aparece no centro da tela

---

### 6.2 Tour sem Steps

**Passos:**
1. Crie um tour vazio (sem steps)
2. Tente fazer preview

**Resultado Esperado:**
- ✅ Mensagem amigável ou nada acontece
- ✅ Não quebra a aplicação

---

### 6.3 Múltiplos Tours Ativos

**Passos:**
1. Crie 2 tours ativos
2. Configure `test.html` com ID específico

**Resultado Esperado:**
- ✅ Widget carrega apenas o tour especificado no `tourId`

---

## Checklist Final ✅

Após executar todos os testes, marque os itens:

### Autenticação
- [ ] Signup funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Redirecionamento correto

### Dashboard (CRUD)
- [ ] Criar tour funciona
- [ ] Editar tour funciona
- [ ] Salvar steps funciona
- [ ] Deletar tour funciona
- [ ] Lista de tours carrega

### Preview
- [ ] Preview no dashboard funciona
- [ ] Navegação (Next, Back, Done) funciona
- [ ] Spotlight destaca elementos

### Widget Público
- [ ] Widget carrega automaticamente
- [ ] Navegação funciona
- [ ] LocalStorage persiste conclusão
- [ ] Reset limpa localStorage

### Analytics
- [ ] Eventos são registrados (view, step_view, complete, skip)
- [ ] Dados aparecem no Supabase
- [ ] Dashboard de analytics mostra métricas corretas
- [ ] Gráfico de steps funciona

### Segurança
- [ ] RLS protege tours entre usuários
- [ ] Analytics funcionam sem autenticação
- [ ] Edge Function retorna apenas tours ativos

### Edge Cases
- [ ] Seletor inválido não quebra
- [ ] Tour sem steps não quebra
- [ ] Múltiplos tours ativos funcionam

---

## 🎯 Resultado Esperado

Ao final deste plano de testes, o sistema TourFlow estará 100% validado e pronto para produção!

**Links Úteis:**
- Dashboard Supabase: https://supabase.com/dashboard/project/sfokolgauqfppgymcyae
- Edge Functions: https://supabase.com/dashboard/project/sfokolgauqfppgymcyae/functions
- Página de Testes: http://localhost:8080/test.html
