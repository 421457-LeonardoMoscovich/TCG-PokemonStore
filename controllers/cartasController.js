const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { resolveCardPrice } = require('../utils/cardPricing');

const MAX_LIMIT = 100;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePositiveInt(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

async function obtenerCartas(req, res) {
  try {
    const db = getDB();
    const { type, hp_min, rarity, page = 1, limit = 20, name, ids, collected } = req.query;

    const filter = {};
    if (type) filter.type = { $regex: new RegExp(escapeRegex(type), 'i') };
    if (hp_min) {
      const minHp = normalizePositiveInt(hp_min, null);
      if (minHp) filter.hp = { $gte: minHp };
    }
    if (rarity) filter.rarity = rarity;
    if (name) filter.name = { $regex: new RegExp(escapeRegex(name), 'i') };
    
    // Filtro por colección (si el usuario está logueado)
    if (collected && req.userId) {
      const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });
      const collection = (usuario && usuario.collection) || [];
      const collectionIds = collection.map(id => new ObjectId(id));
      
      if (collected === 'true') {
        filter._id = { $in: collectionIds };
      } else if (collected === 'false') {
        filter._id = { $nin: collectionIds };
      }
    }

    if (ids) {
      const idArray = ids.split(',').filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));
      if (idArray.length > 0) {
        // Combinar con filtro de colección si ya existe _id
        if (filter._id) {
          const existing = filter._id.$in || filter._id.$nin || [];
          if (filter._id.$in) {
            filter._id.$in = existing.filter(id => idArray.some(aid => aid.equals(id)));
          } else {
            filter._id.$nin = [...new Set([...existing, ...idArray])];
          }
        } else {
          filter._id = { $in: idArray };
        }
      }
    }

    const safePage = normalizePositiveInt(page, 1);
    const safeLimit = normalizePositiveInt(limit, 20, MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;
    const [cartas, total] = await Promise.all([
      db.collection('cartas').find(filter).skip(skip).limit(safeLimit).toArray(),
      db.collection('cartas').countDocuments(filter),
    ]);

    // Enriquecer con precio y con información de si el usuario ya la posee
    let cartasEnriquecidas = cartas.map((carta) => ({
      ...carta,
      price: resolveCardPrice(carta),
    }));
    if (req.userId) {
      const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });
      const userCertIds = (usuario && usuario.collection) || [];
      const userCertIdsStr = userCertIds.map(id => id.toString());
      
      cartasEnriquecidas = cartasEnriquecidas.map(carta => ({
        ...carta,
        isCollected: userCertIdsStr.includes(carta._id.toString())
      }));
    }

    res.json({
      cartas: cartasEnriquecidas,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cartas', detail: err.message });
  }
}

async function obtenerCartaPorId(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const carta = await db.collection('cartas').findOne({ _id: new ObjectId(req.params.id) });
    if (!carta) return res.status(404).json({ error: 'Carta no encontrada' });

    let isCollected = false;
    if (req.userId) {
      const usuario = await db.collection('usuarios').findOne(
        { _id: new ObjectId(req.userId) },
        { projection: { collection: 1 } }
      );
      isCollected = Boolean(usuario?.collection?.some(id => id.toString() === carta._id.toString()));
    }

    res.json({ ...carta, price: resolveCardPrice(carta), isCollected });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener carta', detail: err.message });
  }
}

async function crearCarta(req, res) {
  try {
    const db = getDB();
    const { name, hp, type, rarity, set_name, price } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Los campos name y type son requeridos' });
    }
    const nueva = {
      name,
      hp: hp ? parseInt(hp) : null,
      type,
      rarity,
      set_name,
      price: resolveCardPrice({ price, rarity }),
      createdAt: new Date()
    };
    const result = await db.collection('cartas').insertOne(nueva);
    res.status(201).json({ mensaje: 'Carta creada', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear carta', detail: err.message });
  }
}

async function actualizarCarta(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const updates = { ...req.body };
    if (updates.rarity !== undefined && updates.price === undefined) {
      updates.price = resolveCardPrice({ rarity: updates.rarity });
    } else if (updates.price !== undefined) {
      updates.price = resolveCardPrice(updates);
    }

    const result = await db.collection('cartas').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Carta no encontrada' });
    res.json({ mensaje: 'Carta actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar carta', detail: err.message });
  }
}

async function eliminarCarta(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const result = await db.collection('cartas').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Carta no encontrada' });
    res.json({ mensaje: 'Carta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar carta', detail: err.message });
  }
}

module.exports = { obtenerCartas, obtenerCartaPorId, crearCarta, actualizarCarta, eliminarCarta };
