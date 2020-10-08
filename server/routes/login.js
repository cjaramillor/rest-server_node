const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const _ = require('underscore');
const Usuario = require('../models/usuario');
const { response } = require('./usuario');
const app = express();


app.post("/login", (req, res, next) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usrBD) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (!usrBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o contraseña incorrectos"
                }
            });
        }
        let verifica = bcrypt.compareSync(body.password, usrBD.password);

        if (!verifica) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o contraseña incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usrBD
        }, process.env.SEED_TOKEN, {
            expiresIn: process.env.DUE_DATE
        })

        res.json({
            ok: true,
            usrBD,
            token
        });
        next();
    });

});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post("/google", async(req, res, next) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                "ERROR FATAL 0": err
            });

        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                err
            });
        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(403).json({
                    error: {
                        message: err
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, {
                    expiresIn: process.env.DUE_DATE
                })
                res.json({
                    ok: true,
                    usuarioDB,
                    token
                });
                next();
            }
        } else {
            let new_user = new Usuario();

            new_user.nombre = googleUser.nombre;
            new_user.email = googleUser.email;
            new_user.img = googleUser.img;
            new_user.google = googleUser.google;
            new_user.password = ':)';

            new_user.save((err, nuevoUsuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            err
                        }
                    });
                };

                return res.json({
                    ok: true,
                    usuario: nuevoUsuario
                });

            });
        }

    });
});

module.exports = app;