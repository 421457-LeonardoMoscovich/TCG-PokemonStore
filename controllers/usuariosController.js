const { getDB } = require('../config/db');
const { getRedis } = require('../config/redis');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { generateToken, authMiddleware } = require('../middleware/auth');

async function registro(req, res) {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Los campos email, username y password son requeridos' });
    }

    const db = getDB();
    const existente = await db.collection('usuarios').findOne({ email });
    if (existente) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      email,
      username,
      password: passwordHash,
      balance: 1000,
      collection: [],
      createdAt: new Date(),
    };

    const result = await db.collection('usuarios').insertOne(nuevoUsuario);
    const userId = result.insertedId.toString();
    const token = generateToken(userId, email);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: userId,
        email,
        username,
        balance: 1000,
        collection: [],
        createdAt: nuevoUsuario.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario', detail: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Los campos email y password son requeridos' });
    }

    const db = getDB();
    const usuario = await db.collection('usuarios').findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userId = usuario._id.toString();
    const token = generateToken(userId, email);

    const redis = getRedis();
    await redis.set(`session:${token}`, userId, { EX: 86400 });

    const { password: _omit, ...usuarioSinPassword } = usuario;
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { ...usuarioSinPassword, id: userId },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', detail: err.message });
  }
}

async function obtenerPerfil(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil', detail: err.message });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'El campo username es requerido' });
    }

    const db = getDB();
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const result = await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { username } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Perfil actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar perfil', detail: err.message });
  }
}

async function obtenerColeccion(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { collection: 1 } }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const collectionIds = usuario.collection || [];

    if (collectionIds.length === 0) {
      return res.json({ coleccion: [], total: 0 });
    }

    // Fetch full card details for every card in the collection
    const cartas = await db.collection('cartas')
      .find({ _id: { $in: collectionIds } })
      .toArray();

    res.json({ coleccion: cartas, total: cartas.length });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener colección', detail: err.message });
  }
}

async function obtenerWishlist(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { wishlist: 1 } }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Return string IDs for frontend compatibility
    const wishlist = (usuario.wishlist || []).map(id => id.toString());
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener wishlist', detail: err.message });
  }
}

async function agregarAWishlist(req, res) {
  try {
    const { cardId } = req.params;
    if (!ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: 'ID de carta inválido' });
    }
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const db = getDB();

    // Verify the card exists
    const carta = await db.collection('cartas').findOne({ _id: new ObjectId(cardId) });
    if (!carta) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    // $addToSet prevents duplicates atomically
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { $addToSet: { wishlist: new ObjectId(cardId) } }
    );

    // Return updated wishlist
    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { wishlist: 1 } }
    );
    const wishlist = (usuario.wishlist || []).map(id => id.toString());

    res.json({ mensaje: 'Carta agregada a wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar a wishlist', detail: err.message });
  }
}

async function quitarDeWishlist(req, res) {
  try {
    const { cardId } = req.params;
    if (!ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: 'ID de carta inválido' });
    }
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const db = getDB();

    // $pull removes the element atomically
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { $pull: { wishlist: new ObjectId(cardId) } }
    );

    // Return updated wishlist
    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { wishlist: 1 } }
    );
    const wishlist = (usuario.wishlist || []).map(id => id.toString());

    res.json({ mensaje: 'Carta quitada de wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Error al quitar de wishlist', detail: err.message });
  }
}

module.exports = { registro, login, obtenerPerfil, actualizarPerfil, obtenerColeccion, obtenerWishlist, agregarAWishlist, quitarDeWishlist };
