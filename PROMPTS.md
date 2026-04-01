# 🚀 Prompts para Claude Code — Pokémon Trading App

Ejecutar en orden. Cada prompt es una sesión de Claude Code.
Ruta: `/mnt/c/Users/msi/OneDrive/Documentos/Claude/Projects/BD_II_TPI 1/TP`

---

## PROMPT 1 — Setup inicial del proyecto

```
Estás trabajando en un backend Node.js para una app de trading de cartas Pokémon (TP universitario de Bases de Datos II).

Lee el CLAUDE.md antes de empezar. Está en la raíz del proyecto y tiene toda la info del proyecto.

Tu tarea es hacer el setup inicial completo:

1. Inicializar package.json con el nombre "pokemon-trading-api" y scripts: start (node server.js) y dev (nodemon server.js)
2. Instalar todas las dependencias del CLAUDE.md (express, mongodb, redis, dotenv, jsonwebtoken, bcryptjs y nodemon como devDependency)
3. Crear el archivo .env con los valores del CLAUDE.md
4. Crear el .gitignore con node_modules, .env y los estándar de Node.js
5. Crear la estructura de carpetas: config/, middleware/, models/, controllers/, routes/

Verificá que npm install haya instalado todo correctamente antes de terminar.
Actualizá tasks/todo.md marcando lo completado.
```

---

## PROMPT 2 — Conexión a bases de datos

```
Leé el CLAUDE.md. Continuás con el backend de Pokémon Trading.

MongoDB y Redis ya están corriendo localmente. Tu tarea:

1. Crear config/db.js — conexión a MongoDB usando el driver nativo (no Mongoose). Debe exportar connectDB(), getDB() y closeDB(). Usar la URI del .env.

2. Crear config/redis.js — conexión a Redis usando el paquete 'redis'. Exportar connectRedis(), getRedis() y closeRedis(). Incluir reconexión automática y logging de estado.

3. Verificar que ambas conexiones funcionan corriendo un script de test rápido que imprima:
   - Cantidad de documentos en la colección 'cartas' de MongoDB
   - Resultado de PING a Redis

Usá async/await. Manejo de errores con process.exit(1) si falla la conexión.
Actualizá tasks/todo.md.
```

---

## PROMPT 3 — Middleware y servidor

```
Leé el CLAUDE.md. Continuás con el backend de Pokémon Trading.

Tu tarea:

1. Crear middleware/auth.js con:
   - authMiddleware: valida JWT del header Authorization: Bearer <token>
   - generateToken(userId, email): genera JWT con expiración 24h usando JWT_SECRET del .env
   - Si el token es inválido o no existe, retornar 401 con mensaje en español

2. Crear server.js con:
   - Express app en el puerto del .env (default 3000)
   - Middlewares: express.json(), express.urlencoded(), CORS headers
   - Health check: GET /health → { status: 'ok', timestamp, services: { mongodb: bool, redis: bool } }
   - Graceful shutdown con SIGINT (cerrar DB y Redis correctamente)
   - Logging claro de inicio con puerto y URLs principales
   - Placeholder para las rutas (las agregaremos en el siguiente paso)

3. Arrancar el servidor y verificar que GET /health responde correctamente con curl.

Actualizá tasks/todo.md.
```

---

## PROMPT 4 — CRUD de Cartas

```
Leé el CLAUDE.md. Continuás con el backend de Pokémon Trading.

Tu tarea es crear el módulo completo de Cartas:

1. controllers/cartasController.js con:
   - obtenerCartas: GET paginado, filtros por ?type=, ?hp_min=, ?rarity=, ?page=, ?limit= (default 20)
   - obtenerCartaPorId: GET por _id de MongoDB
   - crearCarta: POST con validación de campos requeridos
   - actualizarCarta: PUT solo campos enviados ($set parcial)
   - eliminarCarta: DELETE

2. routes/cartas.js con:
   - GET / y GET /:id → públicos
   - POST /, PUT /:id, DELETE /:id → protegidos con authMiddleware

3. Registrar las rutas en server.js bajo /api/cartas

4. Probar con curl:
   - GET /api/cartas (debe retornar cartas de MongoDB con paginación)
   - GET /api/cartas?type=Fire&limit=5
   - GET /api/cartas?hp_min=100&page=1&limit=10

La colección 'cartas' ya tiene 2,900 documentos. NO insertar datos de prueba.
Actualizá tasks/todo.md.
```

---

## PROMPT 5 — Usuarios y autenticación

```
Leé el CLAUDE.md. Continuás con el backend de Pokémon Trading.

Tu tarea es crear el módulo de Usuarios:

1. controllers/usuariosController.js con:
   - registro: POST — validar email único, hashear password con bcryptjs (saltRounds: 10), generar JWT, retornar token
   - login: POST — validar credenciales, comparar hash, generar JWT, guardar sesión en Redis (session:{token} con TTL 86400), retornar token
   - obtenerPerfil: GET protegido — retornar datos del usuario sin password
   - actualizarPerfil: PUT protegido — solo username actualizable por ahora

2. routes/usuarios.js con las rutas correspondientes

3. Registrar en server.js bajo /api/usuarios

4. Probar flujo completo:
   a) Registrar usuario nuevo
   b) Login con ese usuario
   c) Usar el token para GET /api/usuarios/perfil
   d) Verificar que la sesión está en Redis: redis-cli GET session:{token}

Actualizá tasks/todo.md.
```

---

## PROMPT 6 — Carrito y Compras

```
Leé el CLAUDE.md. Continuás con el backend de Pokémon Trading.

Tu tarea es crear el módulo de Compras:

1. controllers/comprasController.js con:
   - agregarAlCarrito: POST — agregar cardId + quantity al hash en Redis (carrito:{userId})
   - obtenerCarrito: GET — leer carrito de Redis, enriquecer con datos de MongoDB (nombre, hp, type de cada carta)
   - limpiarCarrito: DELETE — eliminar key de Redis
   - completarCompra: POST — leer carrito Redis, insertar compra en MongoDB, actualizar collection[] del usuario, limpiar carrito Redis. Todo en secuencia correcta.
   - obtenerHistorial: GET — listar compras del usuario desde MongoDB

2. routes/compras.js — todas las rutas protegidas con authMiddleware

3. Registrar en server.js bajo /api/compras

4. Probar flujo completo:
   a) Login y obtener token
   b) Agregar 2 cartas distintas al carrito
   c) Ver carrito (debe mostrar datos enriquecidos de las cartas)
   d) Completar compra
   e) Verificar en MongoDB: db.compras.find()
   f) Verificar que el carrito en Redis fue borrado

Actualizá tasks/todo.md. Actualizá tasks/lessons.md si encontraste algo importante.
```

---

## PROMPT 7 — Testing y verificación final del backend

```
Leé el CLAUDE.md y tasks/todo.md. Estás haciendo la verificación final del backend de Pokémon Trading.

Realizá un test completo de todos los endpoints en orden:

1. Health check
2. Registro de usuario
3. Login
4. GET cartas (público, sin token)
5. GET carta por ID
6. GET perfil (con token)
7. Agregar al carrito
8. Ver carrito
9. Completar compra
10. Ver historial

Para cada endpoint mostrá: comando curl, response recibido, y si pasó ✅ o falló ❌.

Si algo falla, arreglalo antes de continuar.

Al terminar:
- Marcá todo como completo en tasks/todo.md
- Actualizá tasks/lessons.md con lo aprendido
- Mostrá un resumen final de los 14 endpoints con su status
```

---

## PROMPT 8 — Frontend React + Tailwind (Fase 4)

```
Leé el CLAUDE.md. El backend está 100% funcional en localhost:3000.

Ahora vas a crear el frontend. Dentro de la carpeta TP/, creá una subcarpeta 'frontend/'.

Setup inicial:
1. Crear proyecto React con Vite: npm create vite@latest frontend -- --template react
2. Instalar Tailwind CSS siguiendo la guía oficial para Vite
3. Instalar axios para las llamadas a la API
4. Crear src/services/api.js con baseURL http://localhost:3000/api y manejo de token JWT en headers

Páginas a crear:
- /login — Formulario de login + registro (toggle entre ambos)
- /cartas — Grid de cartas con búsqueda por tipo y filtro por HP
- /carta/:id — Detalle de una carta con botón "Agregar al carrito"
- /carrito — Lista del carrito con total y botón "Completar compra"
- /perfil — Datos del usuario y historial de compras

Componentes necesarios:
- CartaCard — Muestra imagen, nombre, tipo, HP, rareza
- Navbar — Logo, links, contador del carrito, logout
- ProtectedRoute — Redirige a /login si no hay token

Requisitos de diseño:
- Tema oscuro (fondo negro/gris oscuro) con acentos en amarillo Pokémon (#FFCB05) y azul (#3B4CCA)
- Cards con hover effects y bordes brillantes según tipo (Fire=rojo, Water=azul, etc.)
- Responsive mobile-first

Arrancá por el setup + api.js + Navbar, luego avanzá página por página.
Verificá que el frontend conecta con el backend antes de seguir.
```

---

## 💡 Tips para usar estos prompts

- **Antes de cada prompt:** Verificar que MongoDB y Redis están corriendo
- **Si algo falla:** Claude Code lo detecta y lo corrige solo (Autonomous Bug Fixing)
- **Lecciones:** Cada corrección se guarda en `tasks/lessons.md` automáticamente
- **Contexto:** El CLAUDE.md da toda la info necesaria — Claude Code no necesita preguntar

### Comandos de inicio en WSL:
```bash
cd "/mnt/c/Users/msi/OneDrive/Documentos/Claude/Projects/BD_II_TPI 1/TP"

# Verificar servicios
mongosh --eval "db.adminCommand('ping')" && redis-cli ping

# Iniciar Claude Code
claude
```
