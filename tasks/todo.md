# 📋 Todo — Pokémon Trading App

## Estado: ✅ Completado

### Fase 3: Backend ✅
- [x] Inicializar proyecto Node.js (package.json, .env, .gitignore)
- [x] Instalar dependencias (express, mongodb, redis, dotenv, jsonwebtoken, bcryptjs, nodemon)
- [x] Crear config/db.js (conexión MongoDB)
- [x] Crear config/redis.js (conexión Redis)
- [x] Crear middleware/auth.js (JWT)
- [x] Crear controllers/cartasController.js (CRUD)
- [x] Crear controllers/usuariosController.js (registro, login, perfil)
- [x] Crear controllers/comprasController.js (carrito, compras)
- [x] Crear routes/cartas.js
- [x] Crear routes/usuarios.js
- [x] Crear routes/compras.js
- [x] Crear server.js (servidor principal)
- [x] Verificar health check
- [x] Probar endpoints con curl

### Fase 4: Frontend React ✅
- [x] Inicializar proyecto React + Tailwind (Vite)
- [x] Crear servicio API (src/services/api.js con axios + JWT interceptor)
- [x] Página /login — formulario login/registro con toggle
- [x] Página /cartas — grid paginado con filtros tipo/hp
- [x] Página /carta/:id — detalle con botón agregar al carrito
- [x] Página /carrito — listado enriquecido + completar compra
- [x] Página /perfil — datos usuario + editar username + historial compras
- [x] Componente CartaCard — imagen, nombre, tipo (con color), HP, rareza
- [x] Componente Navbar — logo, links, contador carrito, logout
- [x] Componente ProtectedRoute — redirige a /login si sin token
- [x] Build de producción sin errores (288KB JS, 23KB CSS)

---

## 🧪 Resultados de testing backend (PROMPT 7)

| # | Endpoint | Resultado |
|---|----------|-----------|
| 1 | GET /health | ✅ mongodb: true, redis: true |
| 2 | POST /api/usuarios/registro | ✅ token generado, balance: 1000 |
| 3 | POST /api/usuarios/login | ✅ token + sesión en Redis |
| 4 | GET /api/cartas | ✅ 2916 cartas, paginación ok |
| 5 | GET /api/cartas?type=Fire | ✅ 232 cartas de tipo Fire |
| 5b | GET /api/cartas/:id | ✅ carta individual con datos completos |
| 6 | GET /api/usuarios/perfil | ✅ datos sin password |
| 7 | POST /api/compras/carrito | ✅ 2 cartas agregadas |
| 8 | GET /api/compras/carrito | ✅ datos enriquecidos de MongoDB |
| 9 | POST /api/compras/completar | ✅ compra guardada en MongoDB, carrito vaciado |
| 10 | GET /api/compras/historial | ✅ compra visible con items y totalPrice |

---

## 🚀 Cómo arrancar

```bash
# Terminal 1 — Backend
cd "/mnt/c/Users/msi/OneDrive/Documentos/Claude/Projects/BD_II_TPI 1/TP"
npm run dev   # http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm run dev   # http://localhost:5173
```
