# Frontend - Fisa Store

## 🛠️ Tecnologias Utilizadas

- **React 18**
- **TypeScript 4.9+**
- **Material-UI (MUI) 5**
- **Zustand** (Gerenciamento de estado)
- **React Router DOM 6**
- **Axios** (Cliente HTTP)
- **Vite** (Build tool)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- **Backend rodando** na porta 8000

### Instalação

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar variáveis de ambiente:**

```bash
cp .env.example .env
```

3. **Editar o arquivo `.env`:**

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENV=development
```

### Executando o Projeto

```bash
npm start
```

O servidor de desenvolvimento estará disponível em: `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
frontend/src/
├── features/              # Arquitetura baseada em features
│   ├── products/         # Feature de produtos
│   ├── checkout/         # Feature de checkout
│   ├── order-success/    # Feature de sucesso do pedido
│   └── orders/           # Feature de pedidos
├── shared/               # Recursos compartilhados
│   ├── components/       # Componentes reutilizáveis
│   ├── services/         # Serviços da API
│   ├── hooks/            # Hooks customizados
│   ├── types/            # Definições de tipos
│   ├── config/           # Configurações
│   ├── constants/        # Constantes
│   └── utils/            # Utilitários
├── store/                # Estado global (Zustand)
├── contexts/             # Contextos React
└── routes/               # Configuração de rotas
```

## 🎯 Funcionalidades

- **Listagem de Produtos** com paginação
- **Carrinho de Compras** com sidebar
- **Checkout** com formulário de pedido
- **Página de Sucesso** após finalizar pedido
- **Responsivo** para mobile e desktop
- **Loading States** e feedback visual
- **Validação de Formulários**

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejecta do Create React App

## 🌍 Variáveis de Ambiente

| Variável            | Descrição             | Padrão                      |
| ------------------- | --------------------- | --------------------------- |
| `REACT_APP_API_URL` | URL da API do backend | `http://localhost:8000/api` |
| `REACT_APP_ENV`     | Ambiente da aplicação | `development`               |
