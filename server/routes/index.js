const express = require('express');

const app = express();

app.use(require('./usuario'), function(req, res, next) { next() });
app.use(require('./login'), function(req, res, next) { next() });

module.exports = app;