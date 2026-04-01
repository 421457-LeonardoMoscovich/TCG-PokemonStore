const { getDB } = require('../config/db');
const { getRedis } = require('../config/redis');
const { ObjectId } = require('mongodb');

async function agregarAlCarrito(req, res) {
  try {
    const { cardId, quantity } = req.body;

    if (!cardId || !ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: 'cardId inválido' });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    const redis = getRedis();
    const key = `carrito:${req.userId}`;

    await redis.hSet(key, cardId, String(quantity));
    await redis.expire(key, 86400);

    return res.status(200).json({ mensaje: 'Carta agregada al carrito' });
  } catch (err) {
    console.error('agregarAlCarrito error:', err);
    return res.status(500).json({ error: 'Error al agregar la carta al carrito' });
  }
}

async function obtenerCarrito(req, res) {
  try {
    const redis = getRedis();
    const key = `carrito:${req.userId}`;

    const hash = await redis.hGetAll(key);

    if (!hash || Object.keys(hash).length === 0) {
      return res.status(200).json({ carrito: [], total_items: 0 });
    }

    const db = getDB();
    const cardIds = Object.keys(hash).map((id) => new ObjectId(id));

    const cartas = await db
      .collection('cartas')
      .find({ _id: { $in: cardIds } }, { projection: { name: 1, hp: 1, type: 1, rarity: 1, image: 1 } })
      .toArray();

    const cartaMap = {};
    for (const carta of cartas) {
      cartaMap[carta._id.toString()] = carta;
    }

    const carrito = Object.entries(hash).map(([cardId, quantity]) => {
      const carta = cartaMap[cardId] || {};
      return {
        cardId,
        quantity: parseInt(quantity, 10),
        name: carta.name || null,
        hp: carta.hp || null,
        type: carta.type || null,
        rarity: carta.rarity || null,
        image: carta.image || null,
      };
    });

    return res.status(200).json({ carrito, total_items: carrito.length });
  } catch (err) {
    console.error('obtenerCarrito error:', err);
    return res.status(500).json({ error: 'Error al obtener el carrito' });
  }
}

async function limpiarCarrito(req, res) {
  try {
    const redis = getRedis();
    await redis.del(`carrito:${req.userId}`);

    return res.status(200).json({ mensaje: 'Carrito vaciado' });
  } catch (err) {
    console.error('limpiarCarrito error:', err);
    return res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
}

async function completarCompra(req, res) {
  try {
    const redis = getRedis();
    const key = `carrito:${req.userId}`;

    const hash = await redis.hGetAll(key);

    if (!hash || Object.keys(hash).length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const db = getDB();
    const cardIds = Object.keys(hash).map((id) => new ObjectId(id));

    const cartas = await db
      .collection('cartas')
      .find({ _id: { $in: cardIds } }, { projection: { price: 1 } })
      .toArray();

    const precioMap = {};
    for (const carta of cartas) {
      precioMap[carta._id.toString()] = carta.price || 10;
    }

    let totalPrice = 0;
    const items = {};
    for (const [cardId, quantity] of Object.entries(hash)) {
      const qty = parseInt(quantity, 10);
      const precio = precioMap[cardId] || 10;
      totalPrice += precio * qty;
      items[cardId] = qty;
    }

    const compra = {
      userId: new ObjectId(req.userId),
      items,
      totalPrice,
      purchasedAt: new Date(),
      status: 'completed',
    };

    const resultado = await db.collection('compras').insertOne(compra);

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { $push: { collection: { $each: cardIds } } }
    );

    await redis.del(key);

    return res.status(200).json({
      mensaje: 'Compra completada',
      compraId: resultado.insertedId,
      totalPrice,
    });
  } catch (err) {
    console.error('completarCompra error:', err);
    return res.status(500).json({ error: 'Error al completar la compra' });
  }
}

async function obtenerHistorial(req, res) {
  try {
    const db = getDB();

    const compras = await db
      .collection('compras')
      .find({ userId: new ObjectId(req.userId) })
      .sort({ purchasedAt: -1 })
      .toArray();

    return res.status(200).json({ compras });
  } catch (err) {
    console.error('obtenerHistorial error:', err);
    return res.status(500).json({ error: 'Error al obtener el historial de compras' });
  }
}

module.exports = {
  agregarAlCarrito,
  obtenerCarrito,
  limpiarCarrito,
  completarCompra,
  obtenerHistorial,
};
