# 🎮 Pokémon Card Trading App — Claude Code Instructions

## 📋 Proyecto

**Nombre:** Pokémon Card Trading App
**TP:** Bases de Datos II — Trabajo Práctico Grupal N°1
**Stack:** Node.js + Express + MongoDB + Redis + React + Tailwind
**Objetivo:** API REST + Frontend para comprar/vender cartas Pokémon

### Infraestructura disponible
- **MongoDB 8.2.6** → `mongodb://localhost:27017/pokemon_db`
  - Corre en **WSL/Ubuntu** (no Windows): `sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log`
  - Colección `cartas`: 2,916 documentos importados
  - Campos: `card_number`, `name`, `hp`, `type`, `rarity`, `set_name`, `image`, `url`
  - Colecciones a crear: `usuarios`, `compras`
- **Redis** → `redis://localhost:6379` (Docker, puerto 6379)
  - Keys: `session:{token}`, `carrito:{userId}`
- **OS:** Ubuntu/WSL | Windows 11
- **Ruta del proyecto:** `/mnt/c/Users/msi/OneDrive/Documentos/Claude/Projects/BD_II_TPI 1/TP`

---

## 🏗️ Arquitectura esperada

### Backend (Node.js + Express)
```
TP/
├── server.js
├── .env
├── package.json
├── config/
│   ├── db.js           # Conexión MongoDB
│   └── redis.js        # Conexión Redis
├── middleware/
│   └── auth.js         # JWT validation
├── models/
│   ├── Usuario.js
│   └── Carta.js
├── controllers/
│   ├── cartasController.js
│   ├── usuariosController.js
│   └── comprasController.js
├── routes/
│   ├── cartas.js
│   ├── usuarios.js
│   └── compras.js
└── tasks/
    ├── todo.md
    └── lessons.md
```

### Frontend (React + Tailwind) — Fase posterior
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/       # API calls
└── public/
```

---

## 🔌 Endpoints requeridos

### Cartas (Público)
- `GET /api/cartas` — Lista paginada, filtros por `type`, `hp_min`, `rarity`
- `GET /api/cartas/:id` — Detalle de carta

### Cartas (Admin/Protegido)
- `POST /api/cartas` — Crear carta
- `PUT /api/cartas/:id` — Actualizar carta
- `DELETE /api/cartas/:id` — Eliminar carta

### Usuarios
- `POST /api/usuarios/registro` — Registro (genera JWT)
- `POST /api/usuarios/login` — Login (guarda sesión en Redis, retorna JWT)
- `GET /api/usuarios/perfil` — Perfil autenticado
- `PUT /api/usuarios/perfil` — Actualizar perfil

### Compras / Carrito
- `POST /api/compras/carrito` — Agregar carta al carrito (Redis)
- `GET /api/compras/carrito` — Ver carrito actual (Redis)
- `DELETE /api/compras/carrito` — Vaciar carrito
- `POST /api/compras/completar` — Finalizar compra (Redis → MongoDB)
- `GET /api/compras/historial` — Historial de compras del usuario

---

## 🗃️ Esquemas MongoDB

### Usuarios
```json
{
  "email": "string (único)",
  "username": "string",
  "password": "string (hash bcrypt)",
  "balance": "number (default: 1000)",
  "collection": ["ObjectId"],
  "createdAt": "Date"
}
```

### Compras
```json
{
  "userId": "ObjectId",
  "items": { "cardId": "quantity" },
  "totalPrice": "number",
  "purchasedAt": "Date",
  "status": "string (completed|pending)"
}
```

---

## 🔐 Auth

- JWT con expiración 24h
- Header: `Authorization: Bearer <token>`
- Sesiones cacheadas en Redis: `session:{token}` con TTL 86400s
- Carrito en Redis: `carrito:{userId}` con TTL 86400s

---

## 📦 Dependencias

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.0.0",
    "redis": "^4.6.0",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## ⚙️ Variables de entorno (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pokemon_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=pokemon_trading_secret_2026_bdii
NODE_ENV=development
```

---

## 🔄 Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## 📋 Task Management

1. **Plan First:** Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `tasks/todo.md`
6. **Capture Lessons:** Update `tasks/lessons.md` after corrections

---

## 🎯 Core Principles

- **Simplicity First:** Make every change as simple as possible. Impact minimal code.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.

---

## 🚀 Comandos útiles

```bash
# Verificar servicios antes de arrancar
mongosh --eval "db.adminCommand('ping')"
redis-cli ping

# Iniciar servidor
npm run dev

# Testing rápido
curl http://localhost:3000/health
curl http://localhost:3000/api/cartas?limit=5 | jq
```

---

## 📝 Notas importantes

- MongoDB ya tiene 2,900 cartas en `pokemon_db.cartas` — NO borrar ni reimportar
- Redis está en Docker, verificar que el container esté corriendo antes de iniciar
- Hashear passwords con `bcryptjs` (saltRounds: 10)
- El carrito usa Redis (TTL 24h), las compras completas van a MongoDB
- Los endpoints de cartas (GET) son públicos, el resto requiere JWT
- Idioma de respuestas API: español para mensajes, inglés para keys JSON
