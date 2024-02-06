const {mongoose} = require('../db')

const passportLocalMongoose = require('passport-local-mongoose');

const usuarioSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    endereco: String,
    adminRestriction: { type: Boolean, default: false }
});


usuarioSchema.plugin(passportLocalMongoose);
const Usuario = mongoose.model("Usuario", usuarioSchema)


module.exports = Usuario