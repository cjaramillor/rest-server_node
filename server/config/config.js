//=======================
//puerto
//=======================
process.env.PORT = process.env.PORT || 3000;


//=======================
//entorno/ambiente
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';


//=======================
//Base de datos 
//=======================

let urlDB;
let dbname = "bd_cafe";
let username = "cjaramillo";
let password = "xTgKHMjXat6dev9j";

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/' + dbname;
} else {
    urlDB = 'mongodb://cjaramillo:xTgKHMjXat6dev9j@cluster0-shard-00-00.su2lq.mongodb.net:27017,cluster0-shard-00-01.su2lq.mongodb.net:27017,cluster0-shard-00-02.su2lq.mongodb.net:27017/db_cafe?ssl=true&replicaSet=atlas-10qqg5-shard-0&authSource=admin&retryWrites=true&w=majority';
}

process.env.URL_DB = urlDB;