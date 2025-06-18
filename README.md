# 🏪 Fisa Store - Sistema de E-commerce

Sistema completo de e-commerce desenvolvido com Laravel (backend) e React (frontend).

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como um teste técnico, demonstrando habilidades em:

- **Arquitetura de Software** (Feature-Based Architecture)
- **Desenvolvimento Full-Stack** (Laravel + React)
- **Gerenciamento de Estado** (Zustand)
- **TypeScript** para type safety
- **UI/UX** com Material-UI
- **API REST** com validação e cache

## 🎯 Funcionalidades Implementadas

### Backend (Laravel)

- ✅ **API REST** com endpoints para produtos, pedidos e clientes
- ✅ **Sistema de Cache** para otimizar performance
- ✅ **Validação de Dados** com middleware customizado
- ✅ **Transações de Banco** para garantir consistência
- ✅ **Paginação** de resultados
- ✅ **Seeders** para dados iniciais

### Frontend (React)

- ✅ **Listagem de Produtos** com paginação e loading states
- ✅ **Carrinho de Compras** com sidebar interativa
- ✅ **Checkout** com formulário validado
- ✅ **Página de Sucesso** com detalhes do pedido
- ✅ **Responsividade** para mobile e desktop
- ✅ **Gerenciamento de Estado** global com Zustand

## 🏗️ Arquitetura e Decisões Técnicas

### Backend - Laravel

**Decisões Arquiteturais:**

- **MVC Pattern** para separação de responsabilidades
- **API Resources** para padronização de respostas
- **Middleware de Cache** para otimização de performance
- **Transações de Banco** para garantir ACID
- **Validação Customizada** com middleware

**Estrutura:**

```
backend/
├── app/
│   ├── Http/Controllers/    # Controladores da API
│   ├── Models/             # Modelos Eloquent
│   └── Http/Middleware/    # Middlewares customizados
├── database/
│   ├── migrations/         # Estrutura do banco
│   └── seeders/           # Dados iniciais
└── routes/api.php         # Rotas da API
```

### Frontend - React

**Decisões Arquiteturais:**

- **Feature-Based Architecture** para organização por domínio
- **Zustand** para gerenciamento de estado (mais simples que Redux)
- **Material-UI** para design system consistente
- **TypeScript** para type safety e melhor DX
- **Axios** para requisições HTTP com interceptors

**Estrutura:**

```
frontend/src/
├── features/              # Organização por domínio
│   ├── products/         # Tudo relacionado a produtos
│   ├── checkout/         # Tudo relacionado a checkout
│   ├── order-success/    # Página de sucesso
│   └── orders/           # Gestão de pedidos
├── shared/               # Recursos compartilhados
│   ├── components/       # Componentes reutilizáveis
│   ├── services/         # Serviços da API
│   ├── hooks/            # Hooks customizados
│   ├── types/            # Definições TypeScript
│   └── config/           # Configurações
└── store/                # Estado global (Zustand)
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **PHP 8.1+** e **Composer**
- **MySQL 8.0+**
- **Node.js 16+** e **npm**
- **Git**

### Passo a Passo

#### 1. **Clone o Repositório**

```bash
git clone https://github.com/hirokz7/fisastore
cd fisacorp
```

#### 2. **Configure o Backend**

```bash
cd backend

# Instalar dependências
composer install

# Configurar ambiente
cp .env.example .env

# Configurar banco de dados no .env
DB_CONNECTION=pgsql
DB_HOST=ep-cool-recipe-a51s0ur2-pooler.us-east-2.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_zxZmFqy73KWk
DB_SSL_MODE=require
CACHE_DRIVER=redis

# Iniciar servidor
php artisan serve
```

**Backend estará rodando em:** `http://localhost:8000`

#### 3. **Configure o Frontend**

```bash
cd frontend

# Instalar dependências
npm install
```

### 🌍 Variáveis de Ambiente do Frontend

Antes de rodar o frontend, configure o arquivo `.env` na pasta `frontend`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENV=development
```

Você pode copiar o exemplo com:

```bash
cp .env.example .env
```

A variável `REACT_APP_API_URL` define a URL base para as requisições do frontend ao backend. Altere conforme o ambiente (produção, staging, etc).

```bash
# Iniciar servidor de desenvolvimento
npm start
```

**Frontend estará rodando em:** `http://localhost:3000`

## 🚀 Deploy em Produção

### Opções 100% Gratuitas Recomendadas

#### **Backend (Laravel) - Render** ⭐

1. Acesse [render.com](https://render.com)
2. Crie uma conta gratuita
3. Clique em "New +" → "Web Service"
4. Conecte seu repositório GitHub
5. Configure:
   - **Name:** `fisa-store-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `PHP`
   - **Build Command:** `composer install`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`
6. Adicione banco PostgreSQL gratuito
7. Configure variáveis de ambiente:
   - `APP_KEY` (gerado automaticamente)
   - `APP_URL` (URL do Render)
   - `DB_*` (configurações do PostgreSQL)
8. Deploy automático!

#### **Frontend (React) - Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Selecione a pasta `frontend`
4. Configure a variável de ambiente:
   - `REACT_APP_API_URL` (URL do backend no Render)
5. Deploy automático!

### **Alternativas Gratuitas**

#### **Backend:**

- **Fly.io** - 3 VMs gratuitas, performance excelente
- **Railway** - $5 crédito/mês (pode durar meses)
- **Netlify Functions** - Para APIs simples

#### **Frontend:**

- **Netlify** - Totalmente gratuito
- **GitHub Pages** - Totalmente gratuito

#### **Banco de Dados:**

- **Render PostgreSQL** - Incluído no plano gratuito
- **Supabase** - PostgreSQL gratuito
- **PlanetScale** - MySQL gratuito

### **Configuração das URLs**

Após o deploy, atualize a variável `REACT_APP_API_URL` no frontend:

```env
# Exemplo com Render
REACT_APP_API_URL=https://fisa-store-backend.onrender.com/api

# Exemplo com Fly.io
REACT_APP_API_URL=https://fisa-store-backend.fly.dev/api
```

## 🔧 Tecnologias Utilizadas

### Backend

- **Laravel 10** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Composer** - Gerenciador de dependências
- **Artisan** - CLI do Laravel

### Frontend

- **React 18** - Biblioteca JavaScript
- **TypeScript 4.9+** - Superset JavaScript
- **Material-UI 5** - Component library
- **Zustand** - Gerenciamento de estado
- **React Router DOM 6** - Roteamento
- **Axios** - Cliente HTTP

## 📊 Endpoints da API

### Produtos

- `GET /api/products?page=1` - Listar produtos com paginação
- `GET /api/products/{id}` - Obter produto específico

### Pedidos

- `POST /api/orders` - Criar novo pedido
- `GET /api/orders` - Listar pedidos

### Clientes

- `GET /api/customers` - Listar clientes

## 🎨 Design e UX

### Cores da Marca

- **Primária:** `#CBE504` (Verde Fisa)
- **Hover:** `#a8b803` (Verde escuro)
- **Background:** `#f5f5f5` (Cinza claro)

### Componentes Principais

- **ProductCard** - Card de produto com status de estoque
- **CartSidebar** - Sidebar do carrinho com controles
- **CheckoutForm** - Formulário de finalização
- **LoadingSpinner** - Indicadores de carregamento

## 🔄 Fluxo do Usuário

1. **Home** → Listagem de produtos com paginação
2. **Adicionar ao Carrinho** → Produto adicionado ao carrinho
3. **Carrinho** → Sidebar com itens e controles
4. **Checkout** → Formulário de finalização
5. **Sucesso** → Confirmação do pedido

## 🧪 Testes e Qualidade

### Backend

- Validação de dados com middleware customizado
- Transações de banco para consistência
- Cache para otimização de performance

### Frontend

- TypeScript para type safety
- Validação de formulários
- Loading states e error handling
- Responsividade mobile-first

## 📈 Performance

### Otimizações Implementadas

- **Cache de Produtos** no backend
- **Paginação** para listas grandes
- **Lazy Loading** de imagens
- **Code Splitting** por features
- **Bundle Optimization** com Vite

## 🔮 Próximos Passos

### Melhorias Sugeridas

- [ ] **Autenticação** com JWT
- [ ] **Testes Unitários** (PHPUnit + Jest)
- [ ] **Docker** para containerização
- [ ] **CI/CD** com GitHub Actions
- [ ] **PWA** para mobile
- [ ] **Real-time** com WebSockets
- [ ] **Analytics** e métricas
- [ ] **SEO** optimization

## 👨‍💻 Desenvolvedor

**Carlos Lima** - Desenvolvedor Full-Stack

### Contato

- **Email:** hiro1kz77@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/carloslima-hkz7/
- **GitHub:** https://github.com/hirokz7/

---

## 📝 Licença

Este projeto foi desenvolvido como teste técnico. Todos os direitos reservados.
