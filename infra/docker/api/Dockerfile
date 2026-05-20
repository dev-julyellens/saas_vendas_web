# API Laravel — multi-stage (development | production)
FROM php:8.3-fpm-alpine AS base

RUN apk add --no-cache su-exec \
    git curl libpng-dev libzip-dev zip unzip postgresql-dev icu-dev oniguruma-dev \
    linux-headers $PHPIZE_DEPS \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_pgsql pgsql bcmath intl opcache pcntl zip \
    && pecl install redis \
    && docker-php-ext-enable redis sodium \
    && apk del $PHPIZE_DEPS linux-headers

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY docker/php-fpm/www.conf /usr/local/etc/php-fpm.d/zz-docker.conf
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www/html

# -----------------------------------------------------------------------------
FROM base AS vendor

USER root
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --optimize-autoloader

# -----------------------------------------------------------------------------
FROM base AS production

USER root
RUN addgroup -g 1000 www 2>/dev/null || true \
    && adduser -u 1000 -G www -s /bin/sh -D www 2>/dev/null || true

COPY --from=vendor /var/www/html/vendor ./vendor
COPY . .

RUN composer dump-autoload --optimize --no-interaction \
    && php artisan package:discover --ansi \
    && chown -R www:www storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/php/php.prod.ini /usr/local/etc/php/conf.d/99-saas.ini

EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm", "-F"]

# -----------------------------------------------------------------------------
FROM base AS development

USER root
RUN addgroup -g 1000 www 2>/dev/null || true \
    && adduser -u 1000 -G www -s /bin/sh -D www 2>/dev/null || true

EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm", "-F"]
