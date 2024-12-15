"use strict";
require('dotenv').config();
const Redis = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

exports.handler = async function (event, context) {
  try {
  
    const body = JSON.parse(event.body);
    const { id, nombre, pais, anio_fundacion, imagen } = body;

 
    if (!id || !nombre || !pais || !anio_fundacion ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son obligatorios: id, nombre, pais, anio_fundacion, imagen' }),
      };
    }


    const key = `fabricante:${id}`;
    const fabricante = await redis.hgetall(key);

    if (!fabricante || Object.keys(fabricante).length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Fabricante no encontrado' }),
      };
    }

  
    await redis.hset(key, {
      nombre,
      pais,
      anio_fundacion: anio_fundacion.toString(),
      imagen,
    });


    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Fabricante actualizado exitosamente',
        data: {
          id,
          nombre,
          pais,
          anio_fundacion,
          imagen,
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error al actualizar el fabricante:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el fabricante', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
