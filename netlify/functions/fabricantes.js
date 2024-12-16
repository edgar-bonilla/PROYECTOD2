"use strict";
require('dotenv').config();
const Redis = require('ioredis');
const headers = require('./headersCORS');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

exports.handler = async function (event, context) {
  try {
  
    const keys = await redis.keys('fabricante:*');

    if (keys.length === 0) {
      return {
        statusCode: 404,
          headers: headers,
        body: JSON.stringify({ message: 'No se encontraron fabricantes' }),
      };
    }

    const fabricantesPromises = keys.map(async (key) => {
      const tipo = await redis.type(key);
      if (tipo !== 'hash') return null; 
      const fabricante = await redis.hgetall(key);
      return {
        id: fabricante.id,
        nombre: fabricante.nombre,
        pais: fabricante.pais,
        anio_fundacion: parseInt(fabricante.anio_fundacion, 10),
        imagen: fabricante.imagen
      };
    });

    const fabricantes = (await Promise.all(fabricantesPromises)).filter(fabricante => fabricante !== null);

    
    return {
      statusCode: 200,
        headers: headers,
      body: JSON.stringify({ 
        message: 'Fabricantes recuperados exitosamente', 
        data: fabricantes 
      }),
    };

  } catch (error) {

    return {
      statusCode: 500,
        headers: headers,
      body: JSON.stringify({ error: 'Error al recuperar los fabricantes', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
