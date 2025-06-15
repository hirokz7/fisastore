# Backend - Sistema de Pedidos

Este é o backend do sistema de pedidos, desenvolvido em Laravel com arquitetura MVC.

## Requisitos

-   PHP 8.1 ou superior
-   Composer
-   PostgreSQL
-   Extensões PHP necessárias:
    -   pdo_pgsql
    -   pgsql
    -   fileinfo
    -   openssl
    -   mbstring
    -   zip
    -   intl

## Instalação

1. Clone o repositório
2. Entre na pasta do projeto:
    ```bash
    cd backend
    ```
3. Instale as dependências:
    ```bash
    composer install
    ```
4. Copie o arquivo .env.example para .env:
    ```bash
    cp .env.example .env
    ```
5. Configure as variáveis de ambiente no arquivo .env:
    ```
    DB_CONNECTION=pgsql
    DB_HOST=ep-cool-recipe-a51s0ur2-pooler.us-east-2.aws.neon.tech
    DB_PORT=5432
    DB_DATABASE=neondb
    DB_USERNAME=neondb_owner
    DB_PASSWORD=npg_zxZmFqy73KWk
    DB_SSL_MODE=require
    ```
6. Gere a chave da aplicação:
    ```bash
    php artisan key:generate
    ```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
    ```bash
    php artisan serve
    ```
2. O servidor estará disponível em `http://localhost:8000`

## Endpoints da API

### Produtos

-   `GET /api/produtos` - Lista todos os produtos
-   `GET /api/produtos/{id}` - Obtém detalhes de um produto
-   `PUT /api/produtos/{id}` - Atualiza um produto

### Pedidos

-   `POST /api/pedidos` - Cria um novo pedido
-   `PUT /api/pedidos/{id}` - Atualiza um pedido
-   `DELETE /api/pedidos/{id}` - Remove um pedido

## Estrutura do Projeto

-   `app/Models/` - Modelos do Eloquent ORM
-   `app/Http/Controllers/` - Controllers da aplicação
-   `routes/api.php` - Rotas da API
-   `database/migrations/` - Migrações do banco de dados

## Funcionalidades Implementadas

1. Cadastro de pedidos com nome do cliente, data de entrega e lista de produtos
2. Validação de estoque ao criar/atualizar pedidos
3. Atualização automática do estoque
4. Cálculo do valor total do pedido
5. Consulta de produtos e estoque
6. Transações de banco de dados para garantir consistência
7. Validação de dados
8. Respostas em formato JSON
