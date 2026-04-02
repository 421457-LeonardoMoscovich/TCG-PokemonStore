const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

async function comprarTicketScratch(req, res) {
  try {
    const db = getDB();

    // 1. Obtener el usuario
    const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(req.userId) });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 2. Verificar balance
    if (usuario.balance < 50) {
      return res.status(400).json({ error: 'Balance insuficiente. Necesitás 50 monedas.' });
    }

    // 3. Obtener cartas que NO posee
    const coleccionUsuario = usuario.collection || [];
    const cartasDisponibles = await db.collection('cartas')
      .find({ _id: { $nin: coleccionUsuario } })
      .toArray();

    if (cartasDisponibles.length === 0) {
      return res.status(400).json({ error: '¡Felicitaciones! Completaste la Pokédex 🎉' });
    }

    // 4. Selección ponderada por rareza (TCG Pocket Icons)
    const PESO_RAREZA = {
      '◊': 60,           // Common (~60%)
      '◊◊': 25,          // Uncommon (~25%)
      '◊◊◊': 10,         // Rare (~10%)
      '◊◊◊◊': 3,          // Rare ex (~3%)
      '☆': 1.5,          // Promo / Illustration Rare (~1.5%)
      '☆☆': 0.4,         // Special Illustration Rare (~0.4%)
      '☆☆☆': 0.1,        // Immersive Rare (~0.1%)
      'Crown Rare': 0.05 // Gold Card (~0.05%)
    };

    // Calculate total weight
    let totalWeight = 0;
    const cartasConPeso = cartasDisponibles.map(carta => {
      const peso = PESO_RAREZA[carta.rarity] || 10; // Default fallback for unknown rarity
      totalWeight += peso;
      return { carta, peso };
    });

    // Select random number based on total weight
    let randomNum = Math.random() * totalWeight;
    let cartaGanada = cartasDisponibles[0]; // Fallback

    for (const item of cartasConPeso) {
      if (randomNum < item.peso) {
        cartaGanada = item.carta;
        break;
      }
      randomNum -= item.peso;
    }

    // 5. Actualizar usuario y registrar compra atómicamente
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      {
        $inc: { balance: -50 },
        $push: { collection: cartaGanada._id }
      }
    );

    // 5b. Registrar en historial de compras para que se vea en Admin Panel
    const compraScratch = {
      userId: new ObjectId(req.userId),
      type: 'scratch',
      items: { [cartaGanada._id.toString()]: 1 },
      totalPrice: 50,
      purchasedAt: new Date(),
      status: 'completed'
    };
    await db.collection('compras').insertOne(compraScratch);

    // 6. Retornar respuesta
    res.json({
      success: true,
      carta: cartaGanada,
      nuevoBalance: usuario.balance - 50,
      mensaje: `¡Obtuviste a ${cartaGanada.name}!`
    });

  } catch (err) {
    console.error('Error en comprarTicketScratch:', err);
    res.status(500).json({ error: 'Error al procesar la compra del ticket', detail: err.message });
  }
}

module.exports = { comprarTicketScratch };
