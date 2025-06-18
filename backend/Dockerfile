# Etapa 1: Instala dependências do PHP e Composer
FROM composer:2.7 as vendor

WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Etapa 2: Imagem final com PHP
FROM php:8.2-cli
WORKDIR /app
COPY --from=vendor /app /app

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000 