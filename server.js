// Importações e configurações iniciais
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash')

// configuração do servidor
const app = express();
const port = 3000;

// importa os arquivos de rota
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');

//Configuração do express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Permite ler dados dos formulários
app.use(express.urlencoded({ extended: true }));
// Faz o conteúdo no public ser enxergado como se estivesse no diretório raiz
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para espionar todas as requisições
app.use((req, res, next) => {
    console.log(`Alguém visitou a URL: ${req.url}`);
    next(); // 'next()' vai passar a requisição para o próximo na fila.
});

// Configuração do express-session
app.use(session({
    secret: 'chave-secreta-random',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // cookie vai expirar em 1 hora
}))

// Configurações do connect-flash
app.use(flash());

// Middleware das mensagens flash
// torna as mensagens disponíveis em qualquer view
app.use((req, res, next) => {
    // --- mensagens ---
    
    //sucesso
    res.locals.success_msg = req.flash('success_msg');

    //erro
    res.locals.error_msg = req.flash('error_msg');

    //erros de validação do express-validator
    res.locals.validation_errors = req.flash('validation_errors');
    next();
})

// Usar as rotas
app.use('/', pageRoutes);
app.use('/', authRoutes);

// Iniciando o Servidor
app.listen(port, () => console.log(`Servidor rodando! Acesse em http://localhost:${port}`));