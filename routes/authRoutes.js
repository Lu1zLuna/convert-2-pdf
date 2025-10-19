const express = require('express');
const router = express.Router();

// Importa o authController
const authController = require('../controllers/authController');

// Define as rotas de autenticação:

// o formulário de registro enviará os dados para esta rota
router.post('register', authController.registerUser);

// o formulário de login enviará os dados para esta rota
router.post('login', authController.loginUser);

//  rota para a página de acesso ao painel de usuário
router.get('painel', authController.getUserPanel);

// rota de logout
router.get('/logout', authController.logoutUser);

// Exporta o router para o server.js
module.exports = router;