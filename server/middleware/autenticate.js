const jwt = require('jsonwebtoken');


//========================
// Verificar token
//========================

let verif_token = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}

let verif_userRol = (req, res, next) => {


    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            error: {
                message: "es necesario rol ADMIN para realizar esta consulta"
            }
        })
    }



}



module.exports = { verif_token, verif_userRol };