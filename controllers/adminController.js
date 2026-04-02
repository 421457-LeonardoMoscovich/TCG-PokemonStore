const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// ═══════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════

async function getDashboardStats(req, res) {
  try {
    const db = getDB();

    // Run all aggregations in parallel
    const [
      totalCartas,
      totalUsuarios,
      totalCompras,
      cartasPorTipo,
      cartasPorRareza,
      cartasPorSet,
      ingresosPorMes,
      topWishlist,
      usuariosRecientes,
      comprasRecientes,
      valorTotal,
    ] = await Promise.all([
      db.collection('cartas').countDocuments(),
      db.collection('usuarios').countDocuments(),
      db.collection('compras').countDocuments(),

      // Cartas por tipo
      db.collection('cartas').aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      // Cartas por rareza
      db.collection('cartas').aggregate([
        { $group: { _id: '$rarity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      // Cartas por set (top 10)
      db.collection('cartas').aggregate([
        { $group: { _id: '$set_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),

      // Ingresos por mes (últimos 12 meses)
      db.collection('compras').aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$purchasedAt' },
              month: { $month: '$purchasedAt' },
            },
            total: { $sum: '$totalPrice' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]).toArray(),

      // Top 10 cartas más agregadas a wishlists
      db.collection('usuarios').aggregate([
        { $unwind: '$wishlist' },
        { $group: { _id: '$wishlist', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'cartas',
            localField: '_id',
            foreignField: '_id',
            as: 'carta',
          },
        },
        { $unwind: { path: '$carta', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            count: 1,
            name: '$carta.name',
            type: '$carta.type',
            image: '$carta.image',
            rarity: '$carta.rarity',
          },
        },
      ]).toArray(),

      // Últimos 10 usuarios
      db.collection('usuarios')
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),

      // Últimas 10 compras
      db.collection('compras')
        .find({})
        .sort({ purchasedAt: -1 })
        .limit(10)
        .toArray(),

      // Valor total de compras
      db.collection('compras').aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]).toArray(),
    ]);

    // Format ingresos por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ingresosFormateados = ingresosPorMes.map((m) => ({
      label: `${meses[m._id.month - 1]} ${m._id.year}`,
      total: m.total,
      count: m.count,
    })).reverse();

    res.json({
      kpis: {
        totalCartas,
        totalUsuarios,
        totalCompras,
        valorTotal: valorTotal[0]?.total || 0,
      },
      cartasPorTipo: cartasPorTipo.map((t) => ({ name: t._id || 'Sin tipo', value: t.count })),
      cartasPorRareza: cartasPorRareza.map((r) => ({ name: r._id || 'Sin rareza', value: r.count })),
      cartasPorSet: cartasPorSet.map((s) => ({ name: s._id || 'Sin set', value: s.count })),
      ingresosPorMes: ingresosFormateados,
      topWishlist,
      usuariosRecientes,
      comprasRecientes,
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas', detail: err.message });
  }
}

// ═══════════════════════════════════════════════════
// CRUD CARTAS (Admin)
// ═══════════════════════════════════════════════════

async function adminCreateCard(req, res) {
  try {
    const db = getDB();
    const { name, hp, type, rarity, set_name, image, url } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Los campos name y type son requeridos' });
    }

    const nueva = {
      name,
      hp: hp ? parseInt(hp) : null,
      type,
      rarity: rarity || null,
      set_name: set_name || null,
      image: image || null,
      url: url || null,
      createdAt: new Date(),
    };

    const result = await db.collection('cartas').insertOne(nueva);
    res.status(201).json({ mensaje: 'Carta creada', id: result.insertedId, carta: { ...nueva, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear carta', detail: err.message });
  }
}

async function adminUpdateCard(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updates = {};
    const allowedFields = ['name', 'hp', 'type', 'rarity', 'set_name', 'image', 'url', 'card_number'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'hp' || field === 'card_number' ? parseInt(req.body[field]) : req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    updates.updatedAt = new Date();

    const result = await db.collection('cartas').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    const carta = await db.collection('cartas').findOne({ _id: new ObjectId(id) });
    res.json({ mensaje: 'Carta actualizada', carta });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar carta', detail: err.message });
  }
}

async function adminDeleteCard(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await db.collection('cartas').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    res.json({ mensaje: 'Carta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar carta', detail: err.message });
  }
}

async function adminBulkDeleteCards(req, res) {
  try {
    const db = getDB();
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' });
    }

    const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

    if (objectIds.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron IDs válidos' });
    }

    const result = await db.collection('cartas').deleteMany({ _id: { $in: objectIds } });

    res.json({ mensaje: `${result.deletedCount} carta(s) eliminada(s)`, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cartas', detail: err.message });
  }
}

// ═══════════════════════════════════════════════════
// GESTIÓN DE USUARIOS (Admin)
// ═══════════════════════════════════════════════════

async function getUsers(req, res) {
  try {
    const db = getDB();
    const { page = 1, limit = 20, q } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { username: { $regex: new RegExp(q, 'i') } },
        { email: { $regex: new RegExp(q, 'i') } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [usuarios, total] = await Promise.all([
      db.collection('usuarios')
        .find(filter, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      db.collection('usuarios').countDocuments(filter),
    ]);

    res.json({
      usuarios,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', detail: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { role } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido. Debe ser "admin" o "user"' });
    }

    // Prevent admin from demoting themselves
    if (id === req.userId && role !== 'admin') {
      return res.status(400).json({ error: 'No puedes quitarte el rol de admin a ti mismo' });
    }

    const result = await db.collection('usuarios').updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: `Rol actualizado a "${role}"` });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar rol', detail: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Prevent admin from deleting themselves
    if (id === req.userId) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta desde el panel de admin' });
    }

    const result = await db.collection('usuarios').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', detail: err.message });
  }
}

module.exports = {
  getDashboardStats,
  adminCreateCard,
  adminUpdateCard,
  adminDeleteCard,
  adminBulkDeleteCards,
  getUsers,
  updateUserRole,
  deleteUser,
};
