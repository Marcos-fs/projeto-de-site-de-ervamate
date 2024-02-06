const Loja = require('./models/loja')

const Admin = require('./models/usuario');
const passportLocalMongoose = require('passport-local-mongoose');

const createAdmin = async () => {

        const existingAdmin = await Admin.findOne({ username: 'admin' });
            const admin = new Admin({ username: 'marco', adminRestriction: true  });
            await Admin.register(admin, 'ervamate'); 
};

createAdmin();

const produto1 = new Loja({
    nome: 'Erva-Mate Tradicional',
    preco: '25.99',
    imagem: '/imagens/mateerva.jpg',
    descricao: 'Erva-mate tradicional para chimarrão',
    qualidade: 'Muito boa'
});

const produto2 = new Loja({
    nome: 'Cuia Artesanal',
    preco: '39.90',
    imagem: '/imagens/cuia.png',
    descricao: 'Cuia feita à mão com detalhes artesanais',
    qualidade: 'Alta qualidade'
});

const produto3 = new Loja({
    nome: 'Bombas para Chimarrão',
    preco: '12.50',
    imagem: '/imagens/bomba.png',
    descricao: 'Bombas de aço inoxidável para chimarrão',
    qualidade: 'Duráveis e resistentes'
});

const produto4 = new Loja({
    nome: 'Tereré Kit',
    preco: '159.99',
    imagem: '/imagens/kit.png',
    descricao: 'Kit completo para preparo de tereré',
    qualidade: 'Perfeito para dias quentes'
});

const produto5 = new Loja({
    nome: 'Chá-Mate em Sachês',
    preco: '18.00',
    imagem: '/imagens/sache.png',
    descricao: 'Sachês práticos de chá-mate para preparo rápido',
    qualidade: 'Sabor intenso'
});

produto1.save()
produto2.save()
produto3.save()
produto4.save()
produto5.save()

