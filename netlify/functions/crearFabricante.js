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
    // Verifica si la solicitud es de tipo OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({}),
      };
    }

    const body = JSON.parse(event.body);
    const { nombre, pais, anio_fundacion, imagen } = body;

    if (!nombre || !pais || !anio_fundacion) {
      return {
        statusCode: 400,
        headers, 
        body: JSON.stringify({ error: 'Todos los campos son obligatorios: nombre, pais, anio_fundacion, imagen' }),
      };
    }

    let id = await redis.get('fabricante:id');
    if (!id) {
      id = 1000;
      await redis.set('fabricante:id', id);
    }

    const newId = await redis.incr('fabricante:id');
    const key = `fabricante:${newId}`;

    await redis.hset(key, {
      id: newId.toString(),
      nombre,
      pais,
      anio_fundacion: anio_fundacion.toString(),
      imagen,
    });

    return {
      statusCode: 201,
      headers, 
      body: JSON.stringify({
        message: 'Fabricante creado exitosamente',
        data: {
          id: newId,
          nombre,
          pais,
          anio_fundacion,
          imagen
        }
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers, 
      body: JSON.stringify({ error: 'Error al crear el fabricante', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
