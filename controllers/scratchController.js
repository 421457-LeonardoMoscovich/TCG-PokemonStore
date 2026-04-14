const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const TICKET_PRICE = 50;

const PESO_RAREZA = {
  '◇': 60,
  '◇◇': 25,
  '◇◇◇': 10,
  '◇◇◇◇': 3,
  '☆': 1.5,
  '☆☆': 0.4,
  '☆☆☆': 0.1,
  'â—Š': 60,
  'â—Šâ—Š': 25,
  'â—Šâ—Šâ—Š': 10,
  'â—Šâ—Šâ—Šâ—Š': 3,
  'â˜†': 1.5,
  'â˜†â˜†': 0.4,
  'â˜†â˜†â˜†': 0.1,
  'Crown Rare': 0.05,
};

function elegirCartaPonderada(cartas) {
  let totalWeight = 0;
  const cartasConPeso = cartas.map((carta) => {
    const peso = PESO_RAREZA[carta.rarity] || 10;
    totalWeight += peso;
    return { carta, peso };
  });

  let randomNum = Math.random() * totalWeight;
  for (const item of cartasConPeso) {
    if (randomNum < item.peso) return item.carta;
    randomNum -= item.peso;
  }

  return cartas[0];
}

async function comprarTicketScratch(req, res) {
  try {
    const db = getDB();
    const userId = new ObjectId(req.userId);

    const usuario = await db.collection('usuarios').findOne({ _id: userId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if ((usuario.balance || 0) < TICKET_PRICE) {
      return res.status(400).json({ error: `Balance insuficiente. Necesitás ${TICKET_PRICE} monedas.` });
    }

    const coleccionUsuario = usuario.collection || [];
    const cartasDisponibles = await db.collection('cartas')
      .find({ _id: { $nin: coleccionUsuario } })
      .toArray();

    if (cartasDisponibles.length === 0) {
      return res.status(400).json({ error: 'Felicitaciones, completaste la Pokédex.' });
    }

    const cartaGanada = elegirCartaPonderada(cartasDisponibles);
    const updatedUser = await db.collection('usuarios').findOneAndUpdate(
      {
        _id: userId,
        balance: { $gte: TICKET_PRICE },
        collection: { $ne: cartaGanada._id },
      },
      {
        $inc: { balance: -TICKET_PRICE },
        $addToSet: { collection: cartaGanada._id },
      },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return res.status(409).json({ error: 'No se pudo completar la compra. Actualizá e intentá de nuevo.' });
    }

    const compraScratch = {
      userId,
      type: 'scratch',
      items: { [cartaGanada._id.toString()]: 1 },
      totalPrice: TICKET_PRICE,
      purchasedAt: new Date(),
      status: 'completed',
    };
    await db.collection('compras').insertOne(compraScratch);

    res.json({
      success: true,
      carta: cartaGanada,
      nuevoBalance: updatedUser.balance || 0,
      mensaje: `Obtuviste a ${cartaGanada.name}.`,
    });
  } catch (err) {
    console.error('Error en comprarTicketScratch:', err);
    res.status(500).json({ error: 'Error al procesar la compra del ticket', detail: err.message });
  }
}

module.exports = { comprarTicketScratch };
