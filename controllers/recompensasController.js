const { getDB } = require('../config/db');
const { getRedis } = require('../config/redis');
const { ObjectId } = require('mongodb');
const { RARE_CARD_RARITIES } = require('../utils/cardPricing');

// Configuración de Recompensas
const RECOMPENSAS_DIARIAS = [50, 100, 150, 200, 250, 300, 500];
const ENERGIA_MAXIMA = 5;
const RECARGA_MINUTOS = 30;
const RECOMPENSA_TRIVIA = 25;
const COSTO_RULETA = 2;

// Probabilidades de la Ruleta
const PREMIOS_RULETA = [
  { tipo: 'monedas', valor: 50, prob: 0.20, label: '50 Monedas' },
  { tipo: 'carta', valor: 'epic', prob: 0.05, label: '¡Carta Épica!' },
  { tipo: 'monedas', valor: 100, prob: 0.15, label: '100 Monedas' },
  { tipo: 'energia', valor: 1, prob: 0.25, label: '+1 Energía' },
  { tipo: 'monedas', valor: 75, prob: 0.15, label: '75 Monedas' },
  { tipo: 'carta', valor: 'rare', prob: 0.10, label: 'Carta Rara' },
  { tipo: 'monedas', valor: 200, prob: 0.08, label: '200 Monedas' },
  { tipo: 'jackpot', valor: 1000, prob: 0.02, label: '¡JACKPOT! (1000)' }
];

/** 
 * Helper para calcular y actualizar la energía actual del usuario.
 * Ahora se asegura de inicializar los campos si no existen.
 */
async function sincronizarEnergia(usuarioId) {
  const db = getDB();
  const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(usuarioId) });
  
  if (!usuario) return null;

  let energy = usuario.energy;
  let lastEnergyUpdate = usuario.lastEnergyUpdate;

  // 1. Inicialización si los campos no existen
  if (energy === undefined || lastEnergyUpdate === undefined) {
    energy = ENERGIA_MAXIMA;
    lastEnergyUpdate = new Date();
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(usuarioId) },
      { $set: { energy, lastEnergyUpdate } }
    );
    return { energy, lastEnergyUpdate };
  }

  // 2. Corrección si la energía es negativa por errores previos
  if (energy < 0) energy = 0;

  // 3. Lógica de recarga por tiempo
  const ahora = new Date();
  const msPasados = ahora - new Date(lastEnergyUpdate);
  const minutosPasados = Math.floor(msPasados / (1000 * 60));

  if (energy < ENERGIA_MAXIMA && minutosPasados >= RECARGA_MINUTOS) {
    const energiaRecuperada = Math.floor(minutosPasados / RECARGA_MINUTOS);
    const nuevaEnergia = Math.min(ENERGIA_MAXIMA, energy + energiaRecuperada);
    
    if (nuevaEnergia !== energy) {
      // Avanzamos el reloj de la última actualización según cuánta energía se recuperó
      const nuevaUltimaActualizacion = new Date(new Date(lastEnergyUpdate).getTime() + energiaRecuperada * RECARGA_MINUTOS * 60 * 1000);
      
      await db.collection('usuarios').updateOne(
        { _id: new ObjectId(usuarioId) },
        { $set: { energy: nuevaEnergia, lastEnergyUpdate: nuevaUltimaActualizacion } }
      );
      
      return { energy: nuevaEnergia, lastEnergyUpdate: nuevaUltimaActualizacion };
    }
  }

  return { energy, lastEnergyUpdate };
}

async function obtenerEstadoRecompensas(req, res) {
  try {
    const db = getDB();
    
    // Sincronizamos la energía (esto inicializa campos si faltan)
    const energiaActualizada = await sincronizarEnergia(req.userId);
    
    const usuario = await db.collection('usuarios').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { balance: 1, lastBonusDate: 1, streakCount: 1 } }
    );

    const ahora = new Date();
    const minutosRestantesParaRecarga = energiaActualizada.energy < ENERGIA_MAXIMA 
      ? RECARGA_MINUTOS - (Math.floor((ahora - new Date(energiaActualizada.lastEnergyUpdate)) / (1000 * 60)) % RECARGA_MINUTOS)
      : 0;

    // Lógica de Bonus Diario
    const ultimaVez = usuario.lastBonusDate ? new Date(usuario.lastBonusDate) : null;
    let disponible = false;
    let mensaje = "";
    let streakActual = usuario.streakCount || 0;

    if (!ultimaVez) {
      disponible = true;
      mensaje = "¡Tu primer bonus diario está listo!";
    } else {
      const msPasados = ahora - ultimaVez;
      const horasPasadas = msPasados / (1000 * 60 * 60);

      if (horasPasadas >= 24) {
        disponible = true;
        if (horasPasadas > 48) {
          streakActual = 0;
          mensaje = "Se perdió la racha, volvemos a empezar.";
        } else {
          mensaje = "¡Tu bonus diario está listo!";
        }
      } else {
        const masSobra = 24 - horasPasadas;
        mensaje = `Vuelve en ${Math.ceil(masSobra)} horas para reclamar.`;
      }
    }

    res.json({
      balance: usuario.balance,
      streak: streakActual,
      streakRewards: RECOMPENSAS_DIARIAS,
      bonusDisponible: disponible,
      mensajeBonus: mensaje,
      energy: energiaActualizada.energy,
      nextEnergyIn: minutosRestantesParaRecarga
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estado', detail: err.message });
  }
}

async function reclamarBonusDiario(req, res) {
  try {
    const db = getDB();
    const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });

    const ahora = new Date();
    const ultimaVez = usuario.lastBonusDate ? new Date(usuario.lastBonusDate) : null;
    
    if (ultimaVez && (ahora - ultimaVez) < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: 'Aún no pasaron 24 horas' });
    }

    let nuevaRacha = (usuario.streakCount || 0) + 1;
    if (ultimaVez && (ahora - ultimaVez) > 48 * 60 * 60 * 1000) {
      nuevaRacha = 1;
    }
    
    const indiceRecompensa = (nuevaRacha - 1) % RECOMPENSAS_DIARIAS.length;
    const monto = RECOMPENSAS_DIARIAS[indiceRecompensa];

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { 
        $inc: { balance: monto },
        $set: { 
          lastBonusDate: ahora,
          streakCount: nuevaRacha
        }
      }
    );

    res.json({ 
      success: true, 
      mensaje: `¡Reclamaste ${monto} monedas! Racha: ${nuevaRacha} días.`,
      nuevoBalance: (usuario.balance || 0) + monto,
      streak: nuevaRacha
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al reclamar bonus', detail: err.message });
  }
}

async function obtenerTrivia(req, res) {
  try {
    const db = getDB();
    
    // Importante: sincronizar antes de chequear energía
    const energiaActualizada = await sincronizarEnergia(req.userId);

    if (energiaActualizada.energy <= 0) {
      return res.status(403).json({ error: 'Sin energía. Esperá un momento para jugar de nuevo.' });
    }

    const cartas = await db.collection('cartas').aggregate([
      {
        $match: {
          hp: { $exists: true, $ne: null },
          image: { $exists: true, $ne: '' }
        }
      },
      { $sample: { size: 4 } }
    ]).toArray();
    
    if (cartas.length < 4) {
      return res.status(500).json({ error: 'No hay suficientes Pokémon para jugar' });
    }

    const correcta = cartas[0];
    const opciones = cartas.map(c => ({ id: c._id, name: c.name })).sort(() => Math.random() - 0.5);
    const nombreNormalizado = correcta.name || '';
    const letrasNombre = nombreNormalizado.replace(/[^a-zA-Z]/g, '').length || nombreNormalizado.length;
    const pistas = [
      { label: 'Tipo', value: correcta.type || 'Desconocido' },
      { label: 'HP', value: correcta.hp ? `${correcta.hp} HP` : 'Sin dato' },
      { label: 'Rareza', value: correcta.rarity || 'Sin dato' },
      { label: 'Inicial', value: nombreNormalizado.charAt(0).toUpperCase() || '?' },
      { label: 'Letras', value: letrasNombre ? `${letrasNombre}` : '?' },
      { label: 'Set', value: correcta.set_name || 'Sin dato' }
    ];

    const redis = getRedis();
    await redis.set(`trivia:${req.userId}`, correcta._id.toString(), { EX: 600 });

    res.json({
      imagen: correcta.image,
      opciones: opciones.map(o => o.name),
      pistas,
      energiaActual: energiaActualizada.energy
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al generar trivia', detail: err.message });
  }
}

async function verificarTrivia(req, res) {
  try {
    const { respuesta } = req.body;
    if (!respuesta) return res.status(400).json({ error: 'Se requiere una respuesta' });

    const redis = getRedis();
    const correctId = await redis.get(`trivia:${req.userId}`);

    if (!correctId) return res.status(400).json({ error: 'Sesión de juego expirada o inexistente' });

    // Sincronizar energía antes de restar (por si pasó el tiempo de recarga justo antes de responder)
    const energiaPrevia = await sincronizarEnergia(req.userId);

    const db = getDB();
    const cartaCorrecta = await db.collection('cartas').findOne({ _id: new ObjectId(correctId) });
    const esCorrecto = cartaCorrecta.name.toLowerCase() === respuesta.toLowerCase();

    const updateData = { 
      $inc: { energy: -1, "stats.triviasJugadas": 1 }
    };

    // Solo seteamos la fecha si bajamos del máximo por primera vez
    if (energiaPrevia.energy === ENERGIA_MAXIMA) {
      updateData.$set = { lastEnergyUpdate: new Date() };
    }

    if (esCorrecto) {
      updateData.$inc["stats.triviasGanadas"] = 1;
      updateData.$inc.balance = RECOMPENSA_TRIVIA;
    }

    const updateResult = await db.collection('usuarios').findOneAndUpdate(
      { _id: new ObjectId(req.userId), energy: { $gt: 0 } },
      updateData,
      { returnDocument: 'after' }
    );

    if (!updateResult) {
      return res.status(403).json({ error: 'No tienes energía suficiente.' });
    }

    const nuevaEnergia = updateResult.energy || 0;
    await redis.del(`trivia:${req.userId}`);

    if (esCorrecto) {
      return res.json({
        success: true,
        correct: true,
        mensaje: `¡Correcto! Es ${cartaCorrecta.name}. Ganaste ${RECOMPENSA_TRIVIA} monedas.`,
        monedasGanadas: RECOMPENSA_TRIVIA,
        energiaActual: nuevaEnergia
      });
    } else {
      return res.json({
        success: false,
        correct: false,
        mensaje: `¡Incorrecto! Era ${cartaCorrecta.name}.`,
        monedasGanadas: 0,
        energiaActual: nuevaEnergia
      });
    }

  } catch (err) {
    res.status(500).json({ error: 'Error al verificar respuesta', detail: err.message });
  }
}

async function girarRuleta(req, res) {
  try {
    const db = getDB();
    const energiaActualizada = await sincronizarEnergia(req.userId);

    if (energiaActualizada.energy < COSTO_RULETA) {
      return res.status(403).json({ error: `Necesitas ${COSTO_RULETA} de energía para girar.` });
    }

    // Lógica de probabilidades
    const rand = Math.random();
    let acumulado = 0;
    let premioGanado = PREMIOS_RULETA[0];

    for (const p of PREMIOS_RULETA) {
      acumulado += p.prob;
      if (rand <= acumulado) {
        premioGanado = p;
        break;
      }
    }

    const updateData = {
      $inc: { "stats.girosRuleta": 1 },
      $set: {}
    };

    // Solo seteamos la fecha si bajamos del máximo por primera vez
    if (energiaActualizada.energy === ENERGIA_MAXIMA) {
      updateData.$set.lastEnergyUpdate = new Date();
    }

    let responseExtra = {};
    let energiaRestante = energiaActualizada.energy - COSTO_RULETA;

    if (premioGanado.tipo === 'monedas') {
      updateData.$inc.balance = premioGanado.valor;
    } else if (premioGanado.tipo === 'energia') {
      energiaRestante = Math.min(ENERGIA_MAXIMA, energiaRestante + premioGanado.valor);
    } else if (premioGanado.tipo === 'carta') {
      const usuario = await db.collection('usuarios').findOne(
        { _id: new ObjectId(req.userId) },
        { projection: { collection: 1 } }
      );
      const coleccion = usuario?.collection || [];

      const carta = await db.collection('cartas').aggregate([
        {
          $match: {
            _id: { $nin: coleccion },
            rarity: { $in: RARE_CARD_RARITIES }
          }
        },
        { $sample: { size: 1 } }
      ]).next();

      if (carta) {
        updateData.$addToSet = { collection: carta._id };
        responseExtra.carta = { name: carta.name, image: carta.image };
      } else {
        premioGanado = { tipo: 'monedas', valor: 150, prob: 0, label: '150 Monedas' };
        updateData.$inc.balance = (updateData.$inc.balance || 0) + premioGanado.valor;
      }
    } else if (premioGanado.tipo === 'jackpot') {
      updateData.$inc.balance = premioGanado.valor;
    }

    updateData.$set.energy = energiaRestante;

    const usuarioActualizado = await db.collection('usuarios').findOneAndUpdate(
      { _id: new ObjectId(req.userId), energy: { $gte: COSTO_RULETA } },
      updateData,
      { returnDocument: 'after' }
    );

    if (!usuarioActualizado) {
      return res.status(403).json({ error: 'Energía insuficiente. Esperá a que se recargue.' });
    }

    res.json({
      success: true,
      index: PREMIOS_RULETA.indexOf(premioGanado), // Para sincronizar la ruleta visual
      recompensa: premioGanado.label,
      premio: premioGanado,
      energiaActual: usuarioActualizado.energy,
      nuevoBalance: usuarioActualizado.balance,
      ...responseExtra
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al girar ruleta', detail: err.message });
  }
}

async function obtenerLogros(req, res) {
  try {
    const db = getDB();
    const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });
    const stats = usuario.stats || {};
    const reclamados = usuario.logrosReclamados || [];
    
    // Extraemos la definición para reusarla
    const LOGROS_DEF = [
      { id: 'primer_paso', titulo: 'Primer Paso', desc: 'Juega tu primera trivia', meta: 1, actual: stats.triviasJugadas || 0, premio: 50 },
      { id: 'experto_trivia', titulo: 'Experto en Trivia', desc: 'Gana 10 trivias', meta: 10, actual: stats.triviasGanadas || 0, premio: 200 },
      { id: 'suertudo', titulo: 'Suertudo', desc: 'Gira la ruleta 5 veces', meta: 5, actual: stats.girosRuleta || 0, premio: 100 },
      { id: 'coleccionista', titulo: 'Coleccionista Novato', desc: 'Ten 5 cartas en tu colección', meta: 5, actual: (usuario.collection || []).length, premio: 150 }
    ];

    const logrosProcesados = LOGROS_DEF.map(l => ({
      ...l,
      completado: l.actual >= l.meta,
      reclamado: reclamados.includes(l.id),
      progreso: Math.min(100, Math.floor((l.actual / l.meta) * 100))
    }));

    res.json({ logros: logrosProcesados });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener logros', detail: err.message });
  }
}

async function reclamarLogro(req, res) {
  try {
    const { logroId } = req.body;
    const db = getDB();
    const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const stats = usuario.stats || {};
    const reclamados = usuario.logrosReclamados || [];

    if (reclamados.includes(logroId)) {
      return res.status(400).json({ error: 'Logro ya reclamado' });
    }

    // Definición idéntica a obtenerLogros
    const LOGROS_DEF = [
      { id: 'primer_paso', meta: 1, actual: stats.triviasJugadas || 0, premio: 50 },
      { id: 'experto_trivia', meta: 10, actual: stats.triviasGanadas || 0, premio: 200 },
      { id: 'suertudo', meta: 5, actual: stats.girosRuleta || 0, premio: 100 },
      { id: 'coleccionista', meta: 5, actual: (usuario.collection || []).length, premio: 150 }
    ];

    const logro = LOGROS_DEF.find(l => l.id === logroId);
    if (!logro) return res.status(404).json({ error: 'Logro no definido' });

    if (logro.actual < logro.meta) {
      return res.status(400).json({ error: 'Meta no alcanzada' });
    }

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      { 
        $inc: { balance: logro.premio },
        $push: { logrosReclamados: logroId }
      }
    );

    res.json({ 
      success: true, 
      mensaje: `¡Reclamaste ${logro.premio} monedas!`,
      nuevoBalance: (usuario.balance || 0) + logro.premio
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al reclamar logro', detail: err.message });
  }
}

module.exports = {
  obtenerEstadoRecompensas,
  reclamarBonusDiario,
  obtenerTrivia,
  verificarTrivia,
  girarRuleta,
  obtenerLogros,
  reclamarLogro
};
