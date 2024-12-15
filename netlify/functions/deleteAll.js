const Redis = require('ioredis');


const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

async function eliminarTodosLosRegistros() {
  try {
 
    await redis.flushdb(); 
    console.log('Todos los registros han sido eliminados.');
  } catch (error) {
    console.error('Error al eliminar los registros:', error);
  } finally {
    await redis.quit(); 
  }
}


eliminarTodosLosRegistros();
