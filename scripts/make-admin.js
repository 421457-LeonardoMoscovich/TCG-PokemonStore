#!/usr/bin/env node
const { getDB } = require('../config/db');
const { connectDB, closeDB } = require('../config/db');

async function makeAdmin(email) {
  try {
    await connectDB();
    const db = getDB();

    // Find user by email
    const user = await db.collection('usuarios').findOne({ email });

    if (!user) {
      console.log(`❌ Usuario con email "${email}" no encontrado`);
      await closeDB();
      process.exit(1);
    }

    console.log('👤 Usuario encontrado:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol actual: ${user.role || 'sin asignar'}`);

    // Update role to admin
    const result = await db.collection('usuarios').updateOne(
      { _id: user._id },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log('\n✅ Rol actualizado a ADMIN');
    }

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('❌ Uso: node make-admin.js <email>');
  process.exit(1);
}

makeAdmin(email);
