const { getDB, getClient } = require('../config/db');
const { getRedis } = require('../config/redis');
const { ObjectId } = require('mongodb');
const { resolveCardPrice } = require('../utils/cardPricing');

const MAX_CART_QUANTITY = 99;

function parseCartQuantity(value) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) {
    return null;
  }
  return quantity;
}

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function agregarAlCarrito(req, res) {
  try {
    const { cardId, quantity } = req.body;
    const objectId = toObjectId(cardId);

    if (!objectId) {
      return res.status(400).json({ error: 'cardId inválido' });
    }

    const parsedQuantity = parseCartQuantity(quantity);
    if (!parsedQuantity) {
      return res.status(400).json({ error: `La cantidad debe ser un entero entre 1 y ${MAX_CART_QUANTITY}` });
    }

    const db = getDB();
    const [usuario, carta] = await Promise.all([
      db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) }),
      db.collection('cartas').findOne({ _id: objectId }, { projection: { _id: 1 } }),
    ]);

    if (!carta) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    if (usuario?.collection?.some((id) => id.toString() === cardId)) {
      return res.status(400).json({ error: 'Ya posees esta carta en tu colección' });
    }

    const redis = getRedis();
    const key = `carrito:${req.userId}`;

    await redis.hSet(key, cardId, String(parsedQuantity));
    await redis.expire(key, 86400);

    return res.status(200).json({ mensaje: 'Carta agregada al carrito' });
  } catch (err) {
    console.error('agregarAlCarrito error:', err);
    return res.status(500).json({ error: 'Error al agregar la carta al carrito' });
  }
}

async function quitarDelCarrito(req, res) {
  try {
    const { cardId } = req.params;
    if (!toObjectId(cardId)) {
      return res.status(400).json({ error: 'cardId inválido' });
    }

    const redis = getRedis();
    await redis.hDel(`carrito:${req.userId}`, cardId);
    return res.status(200).json({ mensaje: 'Carta eliminada del carrito' });
  } catch (err) {
    console.error('quitarDelCarrito error:', err);
    return res.status(500).json({ error: 'Error al eliminar la carta' });
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

    const validEntries = Object.entries(hash)
      .map(([cardId, quantity]) => [cardId, parseCartQuantity(quantity)])
      .filter(([cardId, quantity]) => toObjectId(cardId) && quantity);

    if (validEntries.length === 0) {
      await redis.del(key);
      return res.status(200).json({ carrito: [], total_items: 0 });
    }

    const db = getDB();
    const cardIds = validEntries.map(([id]) => new ObjectId(id));
    const cartas = await db
      .collection('cartas')
      .find(
        { _id: { $in: cardIds } },
        { projection: { name: 1, hp: 1, type: 1, rarity: 1, image: 1, price: 1 } }
      )
      .toArray();

    const cartaMap = {};
    for (const carta of cartas) {
      cartaMap[carta._id.toString()] = carta;
    }

    const carrito = validEntries
      .filter(([cardId]) => cartaMap[cardId])
      .map(([cardId, quantity]) => {
        const carta = cartaMap[cardId];
        return {
          cardId,
          quantity,
          name: carta.name || null,
          hp: carta.hp || null,
          type: carta.type || null,
          rarity: carta.rarity || null,
          image: carta.image || null,
          price: resolveCardPrice(carta),
        };
      });

    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    return res.status(200).json({ carrito, total_items: totalItems });
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

async function insertarCompra(db, compra, session) {
  if (session) {
    await db.collection('compras').insertOne(compra, { session });
    return;
  }
  await db.collection('compras').insertOne(compra);
}

async function completarCompra(req, res) {
  const client = getClient();
  const session = client.startSession();

  try {
    const redis = getRedis();
    const key = `carrito:${req.userId}`;
    const hash = await redis.hGetAll(key);

    if (!hash || Object.keys(hash).length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const validEntries = Object.entries(hash)
      .map(([cardId, quantity]) => [cardId, parseCartQuantity(quantity)])
      .filter(([cardId, quantity]) => toObjectId(cardId) && quantity);

    if (validEntries.length === 0) {
      await redis.del(key);
      return res.status(400).json({ error: 'El carrito no tiene items válidos' });
    }

    const db = getDB();
    const cardIds = validEntries.map(([id]) => new ObjectId(id));
    const [cartas, usuario] = await Promise.all([
      db.collection('cartas').find({ _id: { $in: cardIds } }).toArray(),
      db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) }),
    ]);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (cartas.length !== cardIds.length) {
      return res.status(400).json({ error: 'El carrito contiene cartas que ya no existen' });
    }

    const precioMap = {};
    for (const carta of cartas) {
      precioMap[carta._id.toString()] = resolveCardPrice(carta);
    }

    let totalPrice = 0;
    const items = {};
    for (const [cardId, qty] of validEntries) {
      if (usuario.collection?.some((id) => id.toString() === cardId)) {
        return res.status(400).json({ error: `Ya posees la carta ${cardId} en tu colección` });
      }

      const precio = precioMap[cardId];
      totalPrice += precio * qty;
      items[cardId] = qty;
    }

    if ((usuario.balance || 0) < totalPrice) {
      return res.status(400).json({ error: 'Saldo insuficiente. Ganá más monedas.' });
    }

    const compra = {
      userId: new ObjectId(req.userId),
      items,
      totalPrice,
      type: 'direct',
      purchasedAt: new Date(),
      status: 'completed',
    };

    let nuevoBalance = (usuario.balance || 0) - totalPrice;

    try {
      await session.withTransaction(async () => {
        const updateResult = await db.collection('usuarios').updateOne(
          { _id: new ObjectId(req.userId), balance: { $gte: totalPrice } },
          {
            $inc: { balance: -totalPrice },
            $addToSet: { collection: { $each: cardIds } },
          },
          { session }
        );

        if (updateResult.matchedCount === 0) {
          throw new Error('Saldo insuficiente');
        }

        await insertarCompra(db, compra, session);
      });
    } catch (err) {
      if (err.message === 'Saldo insuficiente') {
        return res.status(400).json({ error: 'Saldo insuficiente. Ganá más monedas.' });
      }

      if (!err.message.includes('Transaction') && !err.message.includes('session')) {
        throw err;
      }

      console.warn('MongoDB Transaction no soportada. Usando fallback secuencial.');
      const updatedUser = await db.collection('usuarios').findOneAndUpdate(
        { _id: new ObjectId(req.userId), balance: { $gte: totalPrice } },
        {
          $inc: { balance: -totalPrice },
          $addToSet: { collection: { $each: cardIds } },
        },
        { returnDocument: 'after' }
      );

      if (!updatedUser) {
        return res.status(400).json({ error: 'Saldo insuficiente. Ganá más monedas.' });
      }

      nuevoBalance = updatedUser.balance || 0;
      await insertarCompra(db, compra);
    }

    await redis.del(key);

    return res.status(200).json({
      mensaje: 'Compra completada',
      totalPrice,
      nuevoBalance,
    });
  } catch (err) {
    console.error('completarCompra error:', err);
    return res.status(500).json({ error: 'Error al completar la compra', detail: err.message });
  } finally {
    await session.endSession();
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
  quitarDelCarrito,
  obtenerCarrito,
  limpiarCarrito,
  completarCompra,
  obtenerHistorial,
};
