# 🚀 CodeForge Academy

Una plataforma educacional impulsada por **Lumina**.

> _«La tecnología suele ser oscura y difícil de entender. Lumina disipa las sombras iluminando el camino de los futuros profesionales tecnológicos con rutas de aprendizaje claras y directas.»_

**CodeForge** es una academia virtual integral de e-learning de formato suscripción. Está diseñada para optimizar la gestión de cursos para desarrolladores e impulsar el talento en IT, eliminando la fricción matemática y técnica entre las suscripciones, pagos automatizados y el acceso al contenido.

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 13.4.0 (PHP) - API REST / Sanctum
- **Frontend:** Angular 21.2.7 (TypeScript) - SPA
- **Base de Datos:** PostgreSQL 18.3
- **Marco de Trabajo:** Scrum (Jira)

## 👥 Equipo de Desarrollo

- Sebastian Salvador Blanco Vaca
- Emerson Raphael Mollo Isla
- Jhomar Edilson Mamani Huanca
- Share Brayan Camacho Banegas

---

## ⚙️ Requisitos Previos

Para levantar este entorno localmente, asegúrese de tener instaladas las siguientes versiones (o superiores):

- PHP `v8.3.30`
- Composer `v2.9.5`
- Node.js `v24.14.1` (LTS)
- npm `v11.11.0`
- Angular CLI `v21.2.7`
- PostgreSQL `v18.3`

---

## 🚀 Instrucciones de Instalación

### 1. Clonar el repositorio

Abra su terminal y ejecute:

```bash
git clone https://github.com/mywhitecow/codeforge.git
```

---

### 2. Configuración de la Base de Datos

1. Abra **pgAdmin** o **DBeaver**.
2. Cree una base de datos vacía con el nombre `lumina_db`.

> **Nota para DBeaver:** En el campo _Database_ de la conexión, asegúrese de borrar el valor por defecto (`postgres`) y escribir `lumina_db`. El resto de los campos quedan así:
>
> - **Host:** `localhost` _(equivalente a `127.0.0.1`)_
> - **Port:** `5432`
> - **Username:** `postgres`
> - **Password:** su contraseña local
>
> Haga clic en **"Test Connection..."** para verificar. Si muestra _"Connected"_, haga clic en **OK** para guardar.

---

### 3. Levantar el Frontend (Angular)

Abra una terminal, navegue a la carpeta del frontend y ejecute los siguientes comandos:

```bash
cd frontend/web-lumina
npm install
```

Para iniciar el servidor de desarrollo, ejecute:

```bash
ng serve -o
```

El frontend se abrirá automáticamente en el navegador en **http://localhost:4200**.

---

### 4. Levantar el Backend (Laravel)

Abra una **nueva terminal** en la raíz del proyecto y navegue a la carpeta del backend:

```bash
cd backend/api-lumina
composer install
cp .env.example .env
php artisan key:generate
```

Abra el archivo `.env` recién creado en su editor de código y configure sus credenciales locales de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lumina_db
DB_USERNAME=postgres
DB_PASSWORD=su_contraseña_aqui
```

Finalmente, construya las tablas en la base de datos y levante el servidor:

```bash
php artisan migrate
php artisan serve
```

El backend estará corriendo en **http://localhost:8000**.
