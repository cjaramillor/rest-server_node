/*
    VARIABLES DE ENTORNO Y CONFIGURACION GLOBAL
*/

//=======================
//puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
//entorno/ambiente
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

//=======================
//vencimiento de token
//=======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.DUE_DATE = 60 * 60 * 24 * 100;

//=======================
//SEED de autenticacion 
//=======================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || "seed-de-token-for-nodejs-dev";

//=======================
//Base de datos 
//=======================

let urlDB;

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/bd_cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URL_DB = urlDB;


//=======================
// Google Client ID
//=======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '687741038529-53fl25dvru94gidddmetepbesu0sik5p.apps.googleusercontent.com';