# Event Ticket Manager (API)

API para el sistema de gestión de locaciones, eventos y tickets. Permite configurar por parametría múltiples locaciones tales como teatros, estadios, campos, etc., definir los eventos a realizar (shows, por ejemplo) y gestionar la disponibilidad y venta de tickets al público.

## Documentación

- [Especificaciones técnicas](./doc/event-ticket-manager-technical-doc.md)

## Requisitos

- Base de datos Mariadb (MySQL)
- Node.js v18.18.2 o superior
- Redis cache server

## Instalación y compilación

Clonar el repositorio [event-ticket-manager-api](https://github.com/jcbryksa/event-ticket-manager-api) para obtener todos los componentes necesarios.

### Base de datos

Crear una nueva base de datos MariaDB (MySQL) y ejecutar sobre ella el script [dump-event_ticket_manager.sql](./sql/dump-event_ticket_manager.sql) que creará la estructura y cargará los datos iniciales.

### Node.js

```bash
$ npm install
$ npm run build
```

### Configuración de ambiente

Crear un archivo .env con la siguiente información:

```bash
HTTP_PORT="[puerto http api]"

# Database
DB_ENGINE=mysql
DB_HOST="[host db]"
DB_PORT="[puerto db]"
DB_USERNAME="[usuario]"
DB_PASSWORD="[clave de usuario]"
DB_DATABASE="[nombre de la base de datos]"

# For Prisma ORM
DATABASE_URL="${DB_ENGINE}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

# Redis
REDIS_HOST="[host redis]"
REDIS_PORT="[puerto redis]"
```

## Puesta en marcha

Para iniciar el servicio se deberá ejecutar el siguiente comando:

```bash
$ npm run start:prod
```

## Pruebas

Para probar la API podemos visualizar los endpoints auto-documentados con Swagger accediendo a `[url base]/swagger` o bien importando la colección Postman [colección Postman](./doc/Event-Ticket-Manager.postman_collection.json) provista para tal fin.

Los endpoints son:

- `PUT` **/cache**<br>
Carga los datos en cache Redis necesarios para el funcionamiento.

- `GET` **/events**<br>
Obtiene lista paginada de eventos (funciones de shows) con posibilidad de filtrado y ordenamiento.

- `GET` **/events/{eventId}**<br>
Obtiene los detalles de un evento en particular, incluyendo todos sus atributos de locación (secciones, precios, filas, butacas, etc.) con su correspondiente disponibilidad al momento de la consulta.

- `POST` **/tickets**<br>
Realiza la reserva (creación de ticket) de N locaciones para un determinado evento, a nombre de un cliente.
