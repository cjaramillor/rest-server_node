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

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/' + dbname;
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URL_DB = urlDB;