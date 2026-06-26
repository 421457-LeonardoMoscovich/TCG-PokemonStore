const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const PUNTOS_VICTORIA = 50;
const PUNTOS_DERROTA = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the TPI's behaviour: if no secret is configured, allow all requests.
function checkSecret(req, res) {
  const configured = process.env.TCG_WEBHOOK_SECRET;
  if (!configured) return true;
  const secret = req.header('X-TCG-Webhook-Secret');
  if (!secret || secret !== configured) {
    res.status(401).json({ error: 'Secreto de webhook inválido' });
    return false;
  }
  return true;
}

/**
 * Recibe el resultado de una partida del TPI Pokémon TCG (Spring Boot) y suma puntos
 * a las cuentas vinculadas por externalUserId (= _id de Mongo de este sitio).
 * Ver docs del TPI: docs/INTEGRACION_SITIO_EXTERNO_CONTRATO.md, Canal A.
 */
async function matchResult(req, res) {
  try {
    if (!checkSecret(req, res)) return;

    const { eventId, gameId, winner, loser } = req.body;
    if (!eventId || !gameId || !winner || !loser) {
      return res.status(400).json({ error: 'Payload incompleto' });
    }

    const db = getDB();

    // Idempotencia: un eventId ya procesado no vuelve a sumar puntos.
    try {
      await db.collection('tcg_webhook_events').insertOne({ eventId, gameId, receivedAt: new Date() });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      throw err;
    }

    const pointsAwarded = {};
    pointsAwarded.winner = await awardPoints(winner.externalUserId, PUNTOS_VICTORIA);
    pointsAwarded.loser = await awardPoints(loser.externalUserId, PUNTOS_DERROTA);

    res.status(200).json({ ok: true, pointsAwarded });
  } catch (err) {
    console.error('Error procesando match-result del TCG:', err);
    res.status(500).json({ error: 'Error interno al procesar el resultado de la partida' });
  }
}

/** Suma puntos al usuario vinculado; si no hay externalUserId válido, no hace nada (no rompe el 200 del webhook). */
async function awardPoints(externalUserId, points) {
  if (!externalUserId || !ObjectId.isValid(externalUserId)) {
    console.warn(`TCG match-result: externalUserId inválido o ausente (${externalUserId}) — no se suman puntos`);
    return 0;
  }
  const db = getDB();
  const result = await db.collection('usuarios').updateOne(
    { _id: new ObjectId(externalUserId) },
    { $inc: { tcgPoints: points } }
  );
  if (result.matchedCount === 0) {
    console.warn(`TCG match-result: no existe usuario con _id ${externalUserId} — no se suman puntos`);
    return 0;
  }
  return points;
}

/**
 * Crea o vincula una cuenta de este sitio cuando alguien se registra en el TPI Pokémon TCG
 * sin haber llegado desde acá (sin `?uid=`). Ver docs/INTEGRACION_SITIO_EXTERNO_CONTRATO.md,
 * Canal C ("TPI -> sitio"). La cuenta creada queda con password aleatoria e inutilizable:
 * sirve para sumar tcgPoints vía Canal A, pero todavía no se puede loguear con ella en el sitio
 * (no hay flujo de "recuperar/asignar contraseña" implementado).
 */
async function syncUser(req, res) {
  try {
    if (!checkSecret(req, res)) return;

    const { playerId, username, email } = req.body;
    if (!playerId || !username || !email) {
      return res.status(400).json({ error: 'Payload incompleto' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }

    const db = getDB();

    const existente = await db.collection('usuarios').findOne({ email: normalizedEmail });
    if (existente) {
      return res.status(200).json({ externalUserId: existente._id.toString() });
    }

    let finalUsername = String(username).trim();
    if (await db.collection('usuarios').findOne({ username: finalUsername })) {
      finalUsername = `${finalUsername}-tcg${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Password aleatoria e inutilizable: esta cuenta nace del lado del TPI, no del sitio.
    const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    const nuevoUsuario = {
      email: normalizedEmail,
      username: finalUsername,
      password: passwordHash,
      role: 'user',
      balance: 1000,
      tcgPoints: 0,
      tcgPlayerId: playerId,
      collection: [],
      wishlist: [],
      achievements: [],
      createdAt: new Date(),
    };

    const result = await db.collection('usuarios').insertOne(nuevoUsuario);
    res.status(201).json({ externalUserId: result.insertedId.toString() });
  } catch (err) {
    console.error('Error procesando sync de usuario del TCG:', err);
    res.status(500).json({ error: 'Error interno al sincronizar el usuario' });
  }
}

/**
 * Recibe coinsEarned/achievements de una partida del TPI y suma las monedas al balance
 * de la cuenta vinculada por externalUserId. No hace nada si el jugador no está vinculado
 * (el TPI no manda el webhook en ese caso, pero se valida igual por las dudas).
 */
async function gameEnded(req, res) {
  try {
    if (!checkSecret(req, res)) return;

    const { externalUserId, coinsEarned, achievements } = req.body;
    if (!externalUserId || !ObjectId.isValid(externalUserId) || typeof coinsEarned !== 'number') {
      return res.status(400).json({ error: 'Payload incompleto' });
    }
    const achievementCodes = Array.isArray(achievements)
      ? achievements.filter((code) => typeof code === 'string' && code.trim())
      : [];

    const db = getDB();
    const update = { $inc: { balance: coinsEarned } };
    if (achievementCodes.length > 0) {
      update.$addToSet = { achievements: { $each: achievementCodes } };
    }
    const result = await db.collection('usuarios').updateOne(
      { _id: new ObjectId(externalUserId) },
      update
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario vinculado no encontrado' });
    }

    res.status(200).json({ ok: true, coinsAwarded: coinsEarned, achievementsAdded: achievementCodes });
  } catch (err) {
    console.error('Error procesando game-ended del TCG:', err);
    res.status(500).json({ error: 'Error interno al procesar el fin de partida' });
  }
}

/**
 * Recibe un gasto de coins del TPI (mascotas, cosméticos, etc.) y descuenta la misma
 * cantidad del balance de la cuenta vinculada — espejo del Canal D, ver
 * docs/INTEGRACION_SITIO_EXTERNO_CONTRATO.md. El balance puede quedar negativo si el
 * sitio ya estaba gastado por otro lado; es el riesgo aceptado de mantener dos balances
 * en espejo en vez de una única fuente de verdad.
 */
async function coinsSpent(req, res) {
  try {
    if (!checkSecret(req, res)) return;

    const { externalUserId, amount, transactionId } = req.body;
    if (!externalUserId || !ObjectId.isValid(externalUserId)
        || typeof amount !== 'number' || amount < 0 || !transactionId) {
      return res.status(400).json({ error: 'Payload incompleto' });
    }

    const db = getDB();

    try {
      await db.collection('tcg_webhook_events').insertOne({ eventId: transactionId, receivedAt: new Date() });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      throw err;
    }

    const result = await db.collection('usuarios').updateOne(
      { _id: new ObjectId(externalUserId) },
      { $inc: { balance: -amount } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario vinculado no encontrado' });
    }

    res.status(200).json({ ok: true, coinsDeducted: amount });
  } catch (err) {
    console.error('Error procesando coins-spent del TCG:', err);
    res.status(500).json({ error: 'Error interno al procesar el gasto de monedas' });
  }
}

/**
 * Recibe las cartas obtenidas al abrir un sobre en el TPI y las persiste en el historial
 * del usuario vinculado para mostrarlas en su perfil del sitio (Canal B).
 */
async function packOpened(req, res) {
  try {
    if (!checkSecret(req, res)) return;

    const { externalUserId, eventId, cards } = req.body;
    if (!externalUserId || !ObjectId.isValid(externalUserId) || !eventId || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Payload incompleto' });
    }

    const db = getDB();

    try {
      await db.collection('tcg_webhook_events').insertOne({ eventId, receivedAt: new Date() });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      throw err;
    }

    await db.collection('tcg_pack_openings').insertOne({
      userId: new ObjectId(externalUserId),
      eventId,
      cards,
      openedAt: new Date(),
    });

    res.status(200).json({ ok: true, cardsReceived: cards.length });
  } catch (err) {
    console.error('Error procesando pack-opened del TCG:', err);
    res.status(500).json({ error: 'Error interno al procesar la apertura del sobre' });
  }
}

module.exports = { matchResult, syncUser, gameEnded, coinsSpent, packOpened };
