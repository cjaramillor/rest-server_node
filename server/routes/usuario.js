const express = require('express');
const app = express();


app.get('/usuario', function(req, res, next) {
    res.json('get usuario LOCAL');
    next();
});

app.post('/usuario', function(req, res, next) {

    let body = req.body;

    if (body.nombre === null) {
        res.status(400).json({
            ok: false,
            mensaje: "nombre es obligatorio"
        });
    } else {
        res.json({ persona: body });
    }
    next();
});

app.put('/usuario/:id', function(req, res, next) {
    let id = req.params.id;
    res.json({
        id
    });
    next();
});

app.delete('/usuario', function(req, res, next) {
    res.json('delete usuario');
    next();
});

module.exports = { app };