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
   
    const body = JSON.parse(event.body);
    const { nombre, nacionalidad, estilo, imagen } = body;

    
    if (!nombre || !nacionalidad || !estilo ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son obligatorios: nombre, nacionalidad, estilo, imagen' }),
      };
    }

  
    const id = await redis.incr('disenador:id');

  
    const key = `disenador:${id}`;

  
    await redis.hset(key, {
      id: id.toString(),
      nombre,
      nacionalidad,
      estilo,
      imagen,
    });

   
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Diseñador creado exitosamente',
        data: {
          id,
          nombre,
          nacionalidad,
          estilo,
          imagen
        }
      }),
    };

  } catch (error) {
  
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear el diseñador', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
