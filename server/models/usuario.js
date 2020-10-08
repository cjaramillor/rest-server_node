const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let roles_validos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} rol no es valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es obligatorio"]
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: roles_validos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);