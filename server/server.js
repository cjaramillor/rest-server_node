require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt"); //libreria para realizar encriptacion de contraseñas
const _ = require("underscore");

const app = express();
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const Usuario = require('../models/usuario');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {

    let desde = Number(req.query.desde);
    let limite = Number(req.query.limite);

    //"nombre email", parametro para indicar columnas a mostrar en cada registro
    Usuario.find({}, "nombre email")
        .where({ estado: true }) //clausula where para la DB
        .skip(desde) //metodo para saltar N cantidad de registros
        .limit(limite) //metodo para traer N cantidad de registros
        .exec((err, usuarios) => {
            if (err) {
                return res.json({
                    "error": String(err)
                });
            } else {

                Usuario.count({ estado: true }, (err, cuenta) => {
                    res.json({
                        ok: true,
                        usuarios,
                        "total_registros": cuenta
                    });
                });


            }
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //metodo hash de una sola linea que permite encriptar contraseñas
        role: body.role
    });

    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(400).send({
                "error": String(err)
            });
        } else {
            res.json({
                ok: true,
                usuario: usuariodb
            })
        }
    });

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let argument_pick = ['nombre', 'email', 'img', 'role', 'estado'];
    let body = _.pick(req.body, argument_pick);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                "error": String(err)
            });
        };

        Usuario.nombre = body.nombre;


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    next();
});

app.delete('/usuario/:id', function(req, res) {

    let id_usuario = req.params.id;
    let estado_desactivado = {
        estado: false
    }

    //Usuario.findById(id_usuario, (err, usr_encontrado) => {
    Usuario.findByIdAndUpdate(id_usuario, estado_desactivado, { new: true }, (err, usr_encontrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        /*
        bloque utilizado para borrar fisicamente un registro en la BD
        if (usr_encontrado === null) {
            return res.json({
                ok: false,
                message: "usuario no encontrado"
            });
        } else {
            usr_encontrado.remove();
            res.json({
                ok: true,
                usuario: usr_encontrado
            });
        }*/
        if (usr_encontrado) {
            res.json({
                ok: true,
                usuario: usr_encontrado
            })
        }

    });

});

//let username = "cjaramillo";
let password = "xTgKHMjXat6dev9j";



//{ useNewUrlParser: true, useUnifiedTopology: true }
//process.env.URL_DB url de la base de datos para distinguir entre ambientes DEV/PROD
mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        password
    })
    .then(() => {
        console.log("DB : ONLINE");
    })
    .catch(err => console.log('Caught', err.stack));


app.listen(process.env.PORT, () => {
    console.log("escuchando puerto :" + process.env.PORT);
});