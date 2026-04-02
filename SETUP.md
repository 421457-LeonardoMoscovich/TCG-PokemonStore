# 🚀 Guía de Configuración Local - Pokémon TCG Vault

Esta guía te ayudará a levantar el proyecto completo (Backend y Frontend) en tu computadora local, conectando MongoDB y Redis.

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:
1.  **Node.js** (v18 o superior)
2.  **Git**
3.  **Docker Desktop** (Altamente recomendado para Redis y Mongo) o instalaciones locales de:
    *   [MongoDB Community Server](https://www.mongodb.com/try/download/community)
    *   [Redis for Windows](https://github.com/tporadowski/redis/releases) (Si no usas Docker)

---

## 🛠️ Paso 1: Clonar e Instalar

1.  Clona el repositorio:
    ```bash
    git clone <url-del-repo>
    cd <carpeta-del-proyecto>
    ```

2.  Instala las dependencias del **Backend** (raíz):
    ```bash
    npm install
    ```

3.  Instala las dependencias del **Frontend**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

---

## 🗄️ Paso 2: Levantar MongoDB y Redis (Método Docker)

La forma más rápida es usar Docker. Ejecuta este comando en la raíz del proyecto:

```bash
# Levantar Redis
docker run -d -p 6379:6379 --name redis-pokemon redis:alpine

# Levantar MongoDB
docker run -d -p 27017:27017 --name mongo-pokemon mongodb/mongodb-community-server:latest
```

*Si ya tienes MongoDB o Redis instalados localmente, asegúrate de que estén corriendo en los puertos por defecto (27017 y 6379).*

---

## 🔑 Paso 3: Configurar Variables de Entorno

Debes crear dos archivos `.env`.

### 1. Backend (Archivo `.env` en la raíz)
Crea un archivo llamado `.env` en la carpeta raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pokemon_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=development
```

### 2. Frontend (Archivo `.env.local` dentro de `/frontend`)
Crea un archivo llamado `.env.local` dentro de la carpeta `frontend/`:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📦 Paso 4: Cargar Datos Iniciales (Migración)

Para tener las cartas en tu base de datos local, ejecuta el script de migración (después de que MongoDB esté corriendo):

```bash
# Asegúrate de estar en la raíz
node send_data.js
```
*Este comando leerá `cards.json` y subirá las más de 2000 cartas a tu MongoDB local.*

---

## 🚀 Paso 5: Ejecución

Ahora puedes levantar ambos servicios:

1.  **Backend (Terminal 1):**
    ```bash
    npm run dev
    ```

2.  **Frontend (Terminal 2):**
    ```bash
    cd frontend
    npm run dev
    ```

Accede a `http://localhost:5173` para ver la aplicación funcionando.

---

## ❓ Solución de Problemas
*   **Error de Conexión Redis:** Asegúrate de que el contenedor de Docker esté corriendo (`docker ps`).
*   **Cartas no aparecen:** Verifica que el script `node send_data.js` terminó sin errores y que tu `MONGODB_URI` es correcta.
