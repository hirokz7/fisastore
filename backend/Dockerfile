# Etapa 1: Instala dependências do PHP e Composer
FROM composer:2.7 as vendor

WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Etapa 2: Imagem final com PHP e extensões necessárias
FROM php:8.2-cli

# Instala extensões do PostgreSQL e outras dependências comuns do Laravel
RUN apt-get update \
    && apt-get install -y libpq-dev unzip git zlib1g-dev libzip-dev libpng-dev libssl-dev libonig-dev pkg-config libxml2-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml bcmath zip

WORKDIR /app
COPY --from=vendor /app /app

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000