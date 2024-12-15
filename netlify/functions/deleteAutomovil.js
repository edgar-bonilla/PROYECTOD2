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
  
    const body = JSON.parse(event.body);
    const { id } = body;

   
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo id es obligatorio para eliminar un automóvil' }),
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


    await redis.del(key);

  
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Automóvil eliminado exitosamente', 
        data: { id } 
      }),
    };

  } catch (error) {
  
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar el automóvil', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};