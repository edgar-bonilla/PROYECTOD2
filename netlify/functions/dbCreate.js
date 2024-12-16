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
  const automoviles = [
    {
      id: '1',
      nombre: 'Ferrari LaFerrari',
      año: 2015,
      velocidad_maxima: '350 km/h',
      fabricante_id: '1',
      disenador_id: '1',
      imagen: 'url-imagen',
    },
    {
      id: '2',
      nombre: 'McLaren P1',
      año: 2014,
      velocidad_maxima: '350 km/h',
      fabricante_id: '2',
      disenador_id: '2',
      imagen: 'url-imagen',
    },
    {
      id: '4',
      nombre: 'Porsche 918 Spyder',
      año: 2015,
      velocidad_maxima: '340 km/h',
      fabricante_id: '4',
      disenador_id: '4',
      imagen: 'url-imagen',
    },
    {
      id: '5',
      nombre: 'Lamborghini Centenario',
      año: 2016,
      velocidad_maxima: '350 km/h',
      fabricante_id: '3',
      disenador_id: '3',
      imagen: 'url-imagen',
    },
    {
      id: '6',
      nombre: 'Bugatti Chiron',
      año: 2017,
      velocidad_maxima: '420 km/h',
      fabricante_id: '5',
      disenador_id: '5',
      imagen: 'url-imagen',
    },
    {
      id: '7',
      nombre: 'Aston Martin Valkyrie',
      año: 2019,
      velocidad_maxima: '402 km/h',
      fabricante_id: '6',
      disenador_id: '6',
      imagen: 'url-imagen',
    }
  ];
  
  const disenadores = [
    {
      id: '1',
      nombre: 'Flavio Manzoni',
      nacionalidad: 'Italiana',
      estilo: 'Futurista, angular',
      imagen: 'flavio-manzoni.jpg',
    },
    {
      id: '2',
      nombre: 'Frank Stephenson',
      nacionalidad: 'Estadounidense',
      estilo: 'Deportivo y aerodinámico',
      imagen: 'frank-stephenson.jpg',
    },
    {
      id: '3',
      nombre: 'Filippo Perini',
      nacionalidad: 'Italiana',
      estilo: 'Futurista, angular',
      imagen: 'filippo-perini.jpg',
    },
    {
      id: '4',
      nombre: 'Chris Bangle',
      nacionalidad: 'Estadounidense',
      estilo: 'Contemporáneo y agresivo',
      imagen: 'chris-bangle.jpg',
    },
    {
      id: '5',
      nombre: 'Adrian Newey',
      nacionalidad: 'Reino Unido',
      estilo: 'Aerodinámico y técnico',
      imagen: 'adrian-newey.jpg',
    },
    {
      id: '6',
      nombre: 'Giorgetto Giugiaro',
      nacionalidad: 'Italiana',
      estilo: 'Elegante y clásico',
      imagen: 'giorgetto-giugiaro.jpg',
    }
  ];
  
  const fabricantes = [
    {
      id: '1',
      nombre: 'Ferrari',
      pais: 'Italia',
      anio_fundacion: 1939,
      imagen: 'ferrari-logo.jpg',
    },
    {
      id: '2',
      nombre: 'McLaren',
      pais: 'Reino Unido',
      anio_fundacion: 1963,
      imagen: 'mclaren-logo.jpg',
    },
    {
      id: '3',
      nombre: 'Lamborghini',
      pais: 'Italia',
      anio_fundacion: 1963,
      imagen: 'lamborghini-logo.jpg',
    },
    {
      id: '4',
      nombre: 'Porsche',
      pais: 'Alemania',
      anio_fundacion: 1931,
      imagen: 'porsche-logo.jpg',
    },
    {
      id: '5',
      nombre: 'Bugatti',
      pais: 'Francia',
      anio_fundacion: 1909,
      imagen: 'bugatti-logo.jpg',
    },
    {
      id: '6',
      nombre: 'Aston Martin',
      pais: 'Reino Unido',
      anio_fundacion: 1913,
      imagen: 'aston-martin-logo.jpg',
    }
  ];
  

  try {
   
    for (let auto of automoviles) {
      await redis.hset(`automovil:${auto.id}`, {
        id: auto.id, 
        nombre: auto.nombre,
        año: auto.año,
        velocidad_maxima: auto.velocidad_maxima,
        fabricante_id: auto.fabricante_id,
        disenador_id: auto.disenador_id,
        imagen: auto.imagen,
      });
    }

    // 🔹 Poblar los diseñadores en Redis
    for (let disenador of disenadores) {
      await redis.hset(`disenador:${disenador.id}`, {
        id: disenador.id, // 🛠️ Agregar el ID del diseñador
        nombre: disenador.nombre,
        nacionalidad: disenador.nacionalidad,
        estilo: disenador.estilo,
        imagen: disenador.imagen,
      });
    }
    
    
    for (let fabricante of fabricantes) {
      await redis.hset(`fabricante:${fabricante.id}`, {
        id: fabricante.id, 
        nombre: fabricante.nombre,
        pais: fabricante.pais,
        anio_fundacion: fabricante.anio_fundacion,
        imagen: fabricante.imagen,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Datos de automóviles, diseñadores y fabricantes poblados exitosamente en Redis' }),
    };
  } catch (error) {
   
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al poblar los datos', details: error.message }),
    };
  } finally {
    await redis.quit();
  }
};
