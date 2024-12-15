"use strict";
require('dotenv').config();
const Redis = require('ioredis');

// 🔹 Configuración de Redis
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

exports.handler = async function (event, context) {
  try {
    // 🔹 1️⃣ Obtener los datos del cuerpo de la solicitud
    const body = JSON.parse(event.body);
    const { id } = body;

    // 🔍 2️⃣ Validar el ID del diseñador
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo id es obligatorio para eliminar un diseñador' }),
      };
    }

    // 🔍 3️⃣ Verificar si el diseñador existe en Redis
    const key = `disenador:${id}`;
    const exists = await redis.exists(key);

    if (!exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `No se encontró un diseñador con el id ${id}` }),
      };
    }

    // ❌ 4️⃣ Eliminar el diseñador de Redis
    await redis.del(key);

    // 🟢 5️⃣ Respuesta de éxito
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Diseñador eliminado exitosamente',
        data: { id },
      }),
    };

  } catch (error) {
    console.error('❌ Error al eliminar el diseñador:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar el diseñador', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
