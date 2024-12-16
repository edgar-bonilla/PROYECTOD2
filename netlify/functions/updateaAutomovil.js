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
    const { id, nombre, año, velocidad_maxima, fabricante_id, disenador_id, imagen } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo id es obligatorio para actualizar un automóvil' }),
      };
    }

    const key = `automovil:${id}`;
    const exists = await redis.exists(key);

    if (!exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `No se encontró un automóvil con el id ${id}` }),
      };
    }

    const updatedFields = {};
    if (nombre) updatedFields.nombre = nombre;
    if (año) updatedFields.año = año.toString();
    if (velocidad_maxima) updatedFields.velocidad_maxima = velocidad_maxima;
    if (fabricante_id) updatedFields.fabricante_id = fabricante_id.toString();
    if (disenador_id) updatedFields.disenador_id = disenador_id.toString();
    if (imagen) updatedFields.imagen = imagen;

    await redis.hset(key, updatedFields);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Automóvil actualizado exitosamente', 
        data: { 
          id, 
          ...updatedFields 
        } 
      }),
    };

  } catch (error) {
  
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el automóvil', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
