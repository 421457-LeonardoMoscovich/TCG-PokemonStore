# 🎮 Pokémon Card Trading App — Setup Local

## 📋 Prerequisites

- **Node.js** 14+ (verificar con `node --version`)
- **MongoDB 8.2.6** en WSL/Ubuntu
- **Redis** en Docker (o local)
- **.env** configurado

---

## 🚀 Instalación Inicial

### 1. Clonar el repositorio
\`\`\`bash
git clone <tu-repo>
cd TP
npm install
\`\`\`

### 2. Verificar servicios

#### MongoDB (WSL/Ubuntu)
\`\`\`bash
# En Ubuntu/WSL:
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log

# Verificar que está corriendo:
mongosh --eval "db.adminCommand('ping')"
\`\`\`

#### Redis (Docker)
\`\`\`bash
# Asegurarse que el contenedor está corriendo:
docker ps | grep redis

# Si no está, iniciar:
docker run -d -p 6379:6379 redis:latest
\`\`\`

### 3. 🔴 CRÍTICO: Agregar precios a las cartas

**Este es el paso que falta en los clones locales y causa que el carrito muestre 0.**

\`\`\`bash
npm run db:add-prices
\`\`\`

Este script agrega automáticamente precios a cada carta basado en su rareza:
- 🔷 **Diamante (◆)**: $50
- 🌟 **Estrella (☆)**: $35
- 💠 **Rombo (◊)**: $20
- 🎵 **Nota (♪)**: $15
- Default: $10

### 4. Iniciar el servidor
\`\`\`bash
npm run dev
\`\`\`

El servidor debe estar en \`http://localhost:3005\`

---

## ✅ Verificación

\`\`\`bash
curl http://localhost:3005/health
\`\`\`

---

## 🐛 Si el carrito sigue mostrando total_items en 0

Ejecutar:
\`\`\`bash
npm run db:add-prices
\`\`\`

Esto agrega precios a TODAS las cartas en MongoDB. El script es idempotente (seguro ejecutar múltiples veces).

