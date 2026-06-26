const { getDB } = require('../config/db');
const { getRedis } = require('../config/redis');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { generateToken, authMiddleware } = require('../middleware/auth');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registro(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim();
    const { password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Los campos email, username y password son requeridos' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 72 caracteres' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'El username debe tener entre 3 y 30 caracteres' });
    }

    const db = getDB();
    const [existenteEmail, existenteUsername] = await Promise.all([
      db.collection('usuarios').findOne({ email }),
      db.collection('usuarios').findOne({ username }),
    ]);
    if (existenteEmail) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    if (existenteUsername) {
      return res.status(409).json({ error: 'El username ya está en uso' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      email,
      username,
      password: passwordHash,
      role: 'user',
      balance: 1000,
      tcgPoints: 0,
      collection: [],
      wishlist: [],
      createdAt: new Date(),
    };

    const result = await db.collection('usuarios').insertOne(nuevoUsuario);
    const userId = result.insertedId.toString();
    const token = generateToken(userId, email, 'user');

    const redis = getRedis();
    await redis.set(`session:${token}`, userId, { EX: 86400 });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: userId,
        email,
        username,
        role: 'user',
        balance: 1000,
        collection: [],
        wishlist: [],
        createdAt: nuevoUsuario.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
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
    const token = generateToken(userId, email, usuario.role || 'user');

    const redis = getRedis();
    await redis.set(`session:${token}`, userId, { EX: 86400 });

    const { password: _omit, ...usuarioSinPassword } = usuario;
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { ...usuarioSinPassword, id: userId },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await getRedis().del(`session:${token}`);
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cerrar sesión' });
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

async function obtenerSobres(req, res) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const sobres = await db
      .collection('tcg_pack_openings')
      .find({ userId: new ObjectId(req.userId) })
      .sort({ openedAt: -1 })
      .limit(5)
      .toArray();

    res.json({ sobres });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener sobres', detail: err.message });
  }
}

module.exports = { registro, login, logout, obtenerPerfil, actualizarPerfil, obtenerColeccion, obtenerWishlist, agregarAWishlist, quitarDeWishlist, obtenerSobres };
