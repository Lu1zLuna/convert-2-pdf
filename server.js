// Importações e configurações iniciais
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para espionar todas as requisições
app.use((req, res, next) => {
    console.log(`Alguém visitou a URL: ${req.url}`);
    next(); // 'next()' passa a requisição para o próximo na fila.
});

//Configuração do express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Faz o conteúdo no public ser enxergado como se estivesse no diretório raiz
app.use(express.static(path.join(__dirname, 'public')));

// Importar o arquivo de rotas
const pageRoutes = require('./routes/pageRoutes');

// Usar as rotas definidas em pageRoutes.js para qualquer requisição no site
app.use('/', pageRoutes);

// Iniciando o Servidor
app.listen(port, () => console.log(`Servidor rodando! Acesse em http://localhost:${port}`));