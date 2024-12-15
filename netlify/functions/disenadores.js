"use strict";
require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

exports.handler = async function (event, context) {
  try {

    const keys = await redis.keys('disenador:*');

    if (keys.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No se encontraron diseñadores' }),
      };
    }


    const disenadoresPromises = keys.map(async (key) => {
      const tipo = await redis.type(key);
      if (tipo !== 'hash') return null; 
      const disenador = await redis.hgetall(key);
      return {
        id: disenador.id,
        nombre: disenador.nombre,
        nacionalidad: disenador.nacionalidad,
        estilo: disenador.estilo,
        imagen: disenador.imagen
      };
    });

    const disenadores = (await Promise.all(disenadoresPromises)).filter(d => d !== null);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Diseñadores recuperados exitosamente',
        data: disenadores
      }),
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al recuperar los diseñadores', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
