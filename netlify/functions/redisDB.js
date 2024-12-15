const Redis = require('ioredis');
require('dotenv').config();
const redis = new Redis({

  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,

});
redis.on('connect', () => {
  console.log('Conectado a Redis Cloud');
});

redis.on('error', (err) => {
  console.error('❌ Error de conexión a Redis:', err);
});

(async () => {
  await redis.set('clave', 'valor');
  const valor = await redis.get('clave');
  console.log('Valor recuperado:', valor);
})();
