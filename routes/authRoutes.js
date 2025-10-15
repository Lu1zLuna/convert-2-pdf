const express = require('express');
const router = express.Router();

// Importa o authController
const authController = require('../controllers/authController');

// Define as rotas de autenticação:

// o formulário de registro enviará os dados para esta rota
router.post('login', authController.registerUser);

// o formulário de login enviará os dados para esta rota

//  rota para a página de acesso ao painel de usuário

// rota de logout