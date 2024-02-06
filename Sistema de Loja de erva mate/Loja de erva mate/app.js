    const express = require("express");
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const Usuario = require('./models/usuario');
    const Loja = require('./models/loja');
    const session = require("express-session");
    const path = require("path");
    const methodOverride = require('method-override')
    const app = express();

    app.set("view engine", 'ejs');

    app.use(express.static('public'))
    app.use(methodOverride('_method'))
    app.use(express.urlencoded({extended: true}));
    app.use(session({ secret: 'segredo', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());


    passport.use(new LocalStrategy(Usuario.authenticate()));

    passport.serializeUser(Usuario.serializeUser());
    passport.deserializeUser(Usuario.deserializeUser());


    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });

    

    const isLoggedIn = (req, res, next) => {
            if(req.isAuthenticated()){
            return next();
        }
            res.redirect("/login");
    }

    //------------------------------------------------
    app.get("/", (req, res) => {
        res.redirect("/lojas");
    });

    app.get("/lojas", async (req, res) => {
            const lojas = await Loja.find({});
            const currentUser = req.user;
            const adminRestriction = currentUser && currentUser.adminRestriction;
            if(!req.session.quantidadeCarrinho)
                req.session.quantidadeCarrinho = 0;
            res.render("index", { lojas, adminRestriction, quantidadeCarrinho: req.session.quantidadeCarrinho });
    });

    app.get('/lojas/new',(req,res)=>{
        res.render('new',{quantidadeCarrinho: req.session.quantidadeCarrinho })
    }) 

    app.get("/lojas/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const loja = await Loja.findById(id);
            const currentUser = req.user;
            const adminRestriction = currentUser && currentUser.adminRestriction;

            res.render("show", { loja, adminRestriction,quantidadeCarrinho: req.session.quantidadeCarrinho  });
        } catch (error) {
            console.error(error);
            res.redirect("/login");
        }
    });


    app.post('/lojas',async(req,res)=>{
        const novaloja = new Loja(req.body)
        await novaloja.save()
        res.redirect('/lojas')
    })

    app.get('/lojas/:id/edit',async (req,res)=>{
        const {id} = req.params
        const loja = await Loja.findById(id)
        res.render('edit',{loja,quantidadeCarrinho: req.session.quantidadeCarrinho })
    })


    app.patch('/lojas/:id',async(req,res)=>{
        const {id} = req.params
        const loja = await Loja.findByIdAndUpdate(id,req.body)
        res.redirect('/lojas/'+id)
    })

    app.delete('/lojas/:id',async(req,res)=>{
        const {id} = req.params
        const loja = await Loja.findByIdAndDelete(id)
        res.redirect('/lojas')
    })


    app.get('/cadastro', (req, res) => {
            res.render('cadastro',{quantidadeCarrinho: req.session.quantidadeCarrinho} );
        });
        
        app.post('/cadastro', async (req, res, next) => {
            try { 
                const { username, password,email,endereco } = req.body;
                const user = new Usuario({ username,email,endereco  });
                await Usuario.register(user, password, (err, usuarioRegistrado) => {
                    if (err) {
                        console.log(err);
                        return res.redirect('/cadastro');
                    }
                    req.login(usuarioRegistrado, err => {
                        if (err) return next(err);
                        return res.redirect('/'); 
                    });
                });
            } catch (e) {
                console.log(e);
                res.redirect('/cadastro');
            }
        });
        
        
        app.get('/login', (req, res) => {
            res.render('login',{quantidadeCarrinho: req.session.quantidadeCarrinho });
        });
        
        app.post('/login', passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
            const redirectUrl = req.session.returnTo || "/";
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        });




        app.get('/logout', (req, res) => {
            req.logout(() => {
                res.redirect("/");
            });
        });
          
        app.get('/carrinho/:id', isLoggedIn, async (req, res) => {
            const { quantidade } = req.query;
            const { id } = req.params;
        
            if (quantidade > 0) {
                req.session.quantidadeCarrinho = quantidade;
            }
           
            const loja = await Loja.findById(id);
        
            res.render('carrinho', { loja, quantidadeCarrinho: req.session.quantidadeCarrinho });
        });
        
        

        app.post('/confirmar', (req, res) => {
            const { quantidade, total, lojaNomeProduto } = req.body;
            if (quantidade > 0) {
                req.session.quantidadeCarrinho = quantidade;
            }
            const quantidadeCarrinho = req.session.quantidadeCarrinho;
            req.session.quantidadeCarrinho = 0;
            res.render('confirmar', {quantidadeCarrinho, total,lojaNomeProduto});
        });
    app.listen(3000, () => {console.log('Servidor ligado na porta 3000!')});