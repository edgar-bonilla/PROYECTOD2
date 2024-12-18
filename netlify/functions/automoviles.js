"use strict";
require('dotenv').config();
const Redis = require('ioredis');
const headers = require('./headersCORS'); // Importar los encabezados CORS

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

exports.handler = async function (event, context) {
  try {
    const keys = await redis.keys('automovil:*');

    if (keys.length === 0) {
      return {
        statusCode: 404,
        headers: headers,  // Incluir encabezados CORS
        body: JSON.stringify({ message: 'No se encontraron automóviles' }),
      };
    }

    const automovilesPromises = keys.map(async (key) => {
      const tipo = await redis.type(key);
      if (tipo !== 'hash') return null;
      const automovil = await redis.hgetall(key);
      return {
        id: automovil.id,
        nombre: automovil.nombre,
        año: parseInt(automovil.año, 10),
        velocidad_maxima: automovil.velocidad_maxima,
        fabricante_id: automovil.fabricante_id,
        disenador_id: automovil.disenador_id,
        imagen: automovil.imagen,
      };
    });

    const automoviles = (await Promise.all(automovilesPromises)).filter(auto => auto !== null);

    return {
      statusCode: 200,
      headers: headers,  // Incluir encabezados CORS
      body: JSON.stringify({ 
        message: 'Automóviles recuperados exitosamente', 
        data: automoviles 
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,  // Incluir encabezados CORS
      body: JSON.stringify({ error: 'Error al recuperar los automóviles', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
