# AGENTS.md - Pokémon Card Trading App

## Project Overview
- **Stack:** Node.js + Express + MongoDB + Redis + React + Tailwind + Vite
- **Language:** JavaScript (backend), JSX/React (frontend)

---

## Build / Lint / Test Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev         # Start dev server (nodemon)
npm start           # Production
curl http://localhost:3000/health
```

### Frontend
```bash
cd frontend/
npm install
npm run dev         # Dev server
npm run build       # Production build
npm run lint        # ESLint
npx eslint src/pages/Cartas.jsx  # Single file
npm run lint -- --fix  # Auto-fix
```

### Testing
- No test framework installed. Manual curl testing:
```bash
curl http://localhost:3000/api/cartas?limit=5
curl http://localhost:3000/api/cartas?type=Fire&hp_min=100
```

---

## Infrastructure
- **MongoDB:** `mongodb://localhost:27017/pokemon_db` (port 27017)
- **Redis:** `redis://localhost:6379` (Docker)

```bash
# Start services (Ubuntu/WSL)
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log
docker run -d -p 6379:6379 --name redis redis:alpine
mongosh --eval "db.adminCommand('ping')"
redis-cli ping
```

---

## Code Style Guidelines

### Backend (JavaScript/Express)

#### Imports - CommonJS
```javascript
const express = require('express');
const { getDB } = require('./config/db');
const { ObjectId } = require('mongodb');
```

#### Naming
- Files: `camelCase` (e.g., `cartasController.js`)
- Functions: `verbCamelCase` (e.g., `obtenerCartas`, `crearUsuario`)
- Constants: `UPPER_SNAKE_CASE`

#### Error Handling
```javascript
async function obtenerCartas(req, res) {
  try { /* ... */ } 
  catch (err) { res.status(500).json({ error: 'Message', detail: err.message }); }
}
if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
```

#### Response Format
- Success: `res.json({ success: true, data: ... })`
- Error: `res.status(400).json({ error: 'Mensaje en español' })`

---

### Frontend (React + Tailwind + Framer Motion)

#### Imports
```javascript
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
```

#### Naming
- Components/Pages: `PascalCase` (e.g., `CartaCard.jsx`)
- Hooks: `useCamelCase` (e.g., `useCart.js`)

#### Component Pattern
```jsx
export default function CartaCard({ carta, onAddedToCart }) {
  const [state, setState] = useState(null);
  useEffect(() => { /* ... */ }, []);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{/* JSX */}</motion.div>;
}
```

#### Color Palette (Type-based)
```javascript
const TYPE_STYLES = {
  Fire: { border: '#E53935', glow: 'rgba(229,57,53,0.4)', badge: '#7f1d1d' },
  Water: { border: '#1E88E5', glow: 'rgba(30,136,229,0.4)', badge: '#1e3a5f' },
  Grass: { border: '#43A047', glow: 'rgba(67,160,71,0.4)', badge: '#14532d' },
  Electric: { border: '#FFEB3B', glow: 'rgba(255,235,59,0.4)', badge: '#713f12' },
  Psychic: { border: '#E91E63', glow: 'rgba(233,30,99,0.4)', badge: '#4a1772' },
  Dragon: { border: '#7C4DFF', glow: 'rgba(124,77,255,0.4)', badge: '#312e81' },
  Colorless: { border: '#9E9E9E', glow: 'rgba(158,158,158,0.2)', badge: '#374151' },
};
```

---

## Project Structure
```
TP/
├── server.js, .env, package.json
├── config/       (db.js, redis.js)
├── middleware/   (auth.js)
├── controllers/ (cartas, usuarios, compras)
├── routes/      (cartas.js, usuarios.js, compras.js)
└── frontend/
    └── src/
        ├── components/, pages/, hooks/, services/
        └── App.jsx
```

---

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cartas` | No | List (paginated, filters) |
| GET | `/api/cartas/:id` | No | Detail |
| POST | `/api/usuarios/registro` | No | Register |
| POST | `/api/usuarios/login` | No | Login (JWT) |
| GET/PUT | `/api/usuarios/perfil` | JWT | Profile |
| POST/GET/DELETE | `/api/compras/carrito` | JWT | Cart (Redis) |
| POST | `/api/compras/completar` | JWT | Purchase |
| GET | `/api/compras/historial` | JWT | History |

---

## Common Tasks
- **New page:** Create in `frontend/src/pages/`, add route in `App.jsx`
- **New API:** Controller → Route → Register in `server.js`
- **Run full stack:** `npm run dev` (backend) + `cd frontend && npm run dev`
