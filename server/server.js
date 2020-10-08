require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/index"));


//process.env.URL_DB variable de entorno para url de la base de datos
mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("DB : ONLINE");
    })
    .catch(err => console.log('Caution ', err.stack));


app.listen(process.env.PORT, () => {
    console.log("LISTEN PORT :" + process.env.PORT);
});