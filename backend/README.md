# Backend - Fisa Store

## 🛠️ Tecnologias Utilizadas

-   **PHP 8.1+**
-   **Laravel 10**
-   **MySQL 8.0**
-   **Composer** (Gerenciador de dependências)
-   **Artisan** (CLI do Laravel)

## 🚀 Como Executar

### Pré-requisitos

-   PHP 8.1 ou superior
-   Composer instalado
-   MySQL 8.0 ou superior
-   Node.js (para compilar assets)

### Instalação

1. **Instalar dependências:**

```bash
composer install
```

2. **Configurar variáveis de ambiente:**

```bash
cp .env.example .env
```

3. **Configurar banco de dados no arquivo `.env`:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fisacorp
DB_USERNAME=root
DB_PASSWORD=sua_senha
```

### Executando o Servidor

```bash
php artisan serve
```

O servidor estará disponível em: `http://localhost:8000`

### Endpoints da API

-   `GET /api/products` - Listar produtos (com paginação)
-   `POST /api/orders` - Criar pedido
-   `GET /api/orders` - Listar pedidos
-   `GET /api/customers` - Listar clientes

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── Http/Controllers/    # Controladores da API
│   ├── Models/             # Modelos Eloquent
│   └── Http/Middleware/    # Middlewares
├── database/
│   ├── migrations/         # Migrações do banco
│   └── seeders/           # Seeders para dados iniciais
├── routes/
│   └── api.php            # Rotas da API
└── config/                # Configurações
```

## Funcionalidades Implementadas

1. Cadastro de pedidos com nome do cliente, data de entrega e lista de produtos
2. Validação de estoque ao criar/atualizar pedidos
3. Atualização automática do estoque
4. Cálculo do valor total do pedido
5. Consulta de produtos e estoque
6. Transações de banco de dados para garantir consistência
7. Validação de dados
8. Respostas em formato JSON
