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
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({}),
      };
    }

    const body = JSON.parse(event.body);
    const { id, nombre, pais, anio_fundacion, imagen } = body;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'El campo id es obligatorio para actualizar un fabricante' }),
      };
    }

    if (!nombre && !pais && !anio_fundacion && !imagen) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Debe proporcionar al menos uno de los campos: nombre, pais, anio_fundacion o imagen' }),
      };
    }

    const key = `fabricante:${id}`;
    const exists = await redis.exists(key);

    if (!exists) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: `No se encontró un fabricante con el id ${id}` }),
      };
    }

    const updatedFields = {};
    if (nombre) updatedFields.nombre = nombre;
    if (pais) updatedFields.pais = pais;
    if (anio_fundacion) updatedFields.anio_fundacion = anio_fundacion.toString();
    if (imagen) updatedFields.imagen = imagen;

    await redis.hset(key, updatedFields);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Fabricante actualizado exitosamente',
        data: { 
          id, 
          ...updatedFields 
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error al actualizar el fabricante:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al actualizar el fabricante', details: error.message }),
    };
  } finally {
    redis.disconnect();
  }
};
