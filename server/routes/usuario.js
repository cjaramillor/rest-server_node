const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

//uso de destructuracion para llamar directamente la funcion dentro
const middle = require('../middleware/autenticate');

const app = express();

app.get('/usuario', function(req, res, next) {


    let desde = Number(req.query.desde);
    let limite = Number(req.query.limite);

    //"nombre email", parametro para indicar columnas a mostrar en cada registro
    Usuario.find({}, "nombre email")
        .where({ estado: true }) //clausula where para la filtrar data
        .skip(desde) //metodo para saltar N cantidad de registros
        .limit(limite) //metodo para traer N cantidad de registros
        .exec((err, usuarios) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            } else {

                Usuario.countDocuments({ estado: true }, function(count, err) {
                    res.json({
                        ok: true,
                        usuarios
                    });
                    next();
                });

            }
        });
});
//metodo POST para creacion de nuevos registros
app.post('/usuario', [middle.verif_token, middle.verif_userRol], function(req, res) {

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
//metodo PUT  para modificacion/actualizacion de registros existentes
app.put('/usuario/:id', [middle.verif_token, middle.verif_userRol], function(req, res) {
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
});

app.delete('/usuario/:id', [middle.verif_token, middle.verif_userRol], function(req, res) {

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


module.exports = app;