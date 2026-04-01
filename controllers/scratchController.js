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

    // 4. Selección ponderada por rareza
    const PESO_RAREZA = {
      'Common': 50,
      'Uncommon': 30,
      'Rare': 15,
      'Rare Holo': 4,
      'Rare Ultra': 1,
    };

    // Calculate total weight
    let totalWeight = 0;
    const cartasConPeso = cartasDisponibles.map(carta => {
      const peso = PESO_RAREZA[carta.rarity] || 10; // Default weight = 10
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

    // 5. Actualizar usuario atómicamente
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(req.userId) },
      {
        $inc: { balance: -50 },
        $push: { collection: cartaGanada._id }
      }
    );

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
