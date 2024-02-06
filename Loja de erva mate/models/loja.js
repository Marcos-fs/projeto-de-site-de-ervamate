const {mongoose} = require('../db')

const lojaSchema = new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String,
    descricao: String,
    qualidade: String,

})

const Loja = mongoose.model("Loja", lojaSchema)

module.exports = Loja
