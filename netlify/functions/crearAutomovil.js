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
    // Verifica si la solicitud es de tipo POST
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({}),
      };
    }

    const body = JSON.parse(event.body);
    const { nombre, año, velocidad_maxima, fabricante_id, disenador_id, imagen } = body;

    if (!nombre || !año || !velocidad_maxima || !fabricante_id || !disenador_id ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Todos los campos son obligatorios: nombre, año, velocidad_maxima, fabricante_id, disenador_id, imagen' }),
      };
    }

    const id = await redis.incr('automovil:id');
    const key = `automovil:${id}`;

    await redis.hset(key, {
      id: id.toString(),
      nombre,
      año: año.toString(),
      velocidad_maxima,
      fabricante_id: fabricante_id.toString(),
      disenador_id: disenador_id.toString(),
      imagen,
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        message: 'Automóvil creado exitosamente', 
        data: { 
          id, 
          nombre, 
          año, 
          velocidad_maxima, 
          fabricante_id, 
          disenador_id, 
          imagen 
        } 
      }),
    };

  } catch (error) {
    console.error('❌ Error al crear el automóvil:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al crear el automóvil', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
