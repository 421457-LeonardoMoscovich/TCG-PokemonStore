# 📚 Lessons Learned — Pokémon Trading App

## Reglas del proyecto

### Infraestructura
- MongoDB ya tiene datos importados (2,900 cartas). NUNCA eliminar ni reimportar.
- Redis corre en Docker en puerto 6379. Verificar `docker ps` antes de iniciar.
- Ambas bases de datos deben estar corriendo antes de `npm run dev`.

### Código
- Hashear passwords SIEMPRE con bcryptjs (saltRounds: 10). Nunca guardar en texto plano.
- JWT expira en 24h. Sesiones cacheadas en Redis con el mismo TTL.
- Carrito → Redis. Compras completadas → MongoDB. No mezclar.
- Usar `ObjectId` de mongodb al trabajar con IDs en queries.

### Estilo
- Mensajes de respuesta API en español, keys JSON en inglés.
- Responses siempre con estructura `{ data, pagination }` para listas y `{ message }` para mutaciones.
- Error handling con try/catch en todos los controllers.

---

## Correcciones y aprendizajes

*(Se actualiza automáticamente después de cada corrección del usuario)*
