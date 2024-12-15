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
    
    console.log('📥 Datos recibidos desde el frontend:', event.body);

    let body;
    try {
   
      body = JSON.parse(event.body);
      console.log('✅ Cuerpo parseado con éxito:', body);
    } catch (parseError) {
      console.error('❌ Error al parsear el cuerpo de la solicitud:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'No se pudo procesar la solicitud, asegúrese de que el cuerpo esté en formato JSON válido',
          details: parseError.message 
        }),
      };
    }

    const { id } = body;

    // Validar el ID
    if (!id || typeof id !== 'string') {
      console.error('❌ El ID no es válido o no se envió:', id);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'El campo id es obligatorio y debe ser una cadena válida para eliminar un fabricante',
          details: `Valor recibido para id: ${id}` 
        }),
      };
    }

    const key = `fabricante:${id}`;
    console.log(`🔍 Verificando si existe la clave: ${key}`);
    const exists = await redis.exists(key);

    if (!exists) {
      console.error(`❌ No se encontró un fabricante con el id: ${id}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: `No se encontró un fabricante con el id ${id}` 
        }),
      };
    }

    console.log(`🗑️ Eliminando la clave: ${key}`);
    await redis.del(key);

    console.log(`✅ Fabricante con ID ${id} eliminado exitosamente`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Fabricante eliminado exitosamente',
        data: { id },
      }),
    };

  } catch (error) {
    console.error('❌ Error general al eliminar el fabricante:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al eliminar el fabricante', 
        details: error.message 
      }),
    };
  } finally {
    console.log('🔌 Desconectando de Redis');
    redis.disconnect(); 
  }
};
