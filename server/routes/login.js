const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const _ = require('underscore');

const Usuario = require('../models/usuario');

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

module.exports = app;