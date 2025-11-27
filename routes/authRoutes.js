const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// middlewares
const { ensureGuest, ensureAuth } = require('../middlewares/auth');

// Importa os controllers
const pageController = require('../controllers/pageController');
const authController = require('../controllers/authController');

// ===== Define as rotas de autenticação: =====

// --- REGISTER ---

// GET /register
router.get('/register', ensureGuest, pageController.getRegisterPage);

// POST /register - o formulário de registro enviará os dados para esta rota
router.post(
    '/register',
    [
        // regra 1: o campo 'nome' não pode estar vazio.
        body('nome')
            .trim() // remove espaços em branco
            .notEmpty().withMessage('O campo nome é obrigatório'),

        // regra 2: o campo 'email' deve ser um e-mail válido.
        body('email')
            .isEmail().withMessage('Por favor, insira um e-mail válido'),

        //regra 3: o campo 'senha' deve ter no mínimo 8 caracteres
        body('senha')
            .isLength({ min: 8}).withMessage('A senha deve ter no mínimo 8 caracteres.'),

        // regra 4: o campo 'confirmarSenha' deve ser igual ao campo 'senha'
        body('confirmarSenha')
            .custom((value, { req }) => value === req.body.senha)
            .withMessage('As senhas não coincidem.')

    ],
    authController.postRegister
);

// --- LOGIN ---

// GET - /login
router.get('/login', ensureGuest, pageController.getLoginPage);

// POST /login - o formulário de login enviará os dados para esta rota
router.post(
    '/login',
    [
        // Validações simples
        body('email').isEmail().withMessage('Por favor, insira um e-mail válido.'),
        body('senha').notEmpty().withMessage('A senha é obrigatória.')
    ],
    authController.postLogin
);

// --- LOGOUT ---

// GET /logout - usar o controller
router.get('/logout', ensureAuth, authController.getLogout);

// Exporta o router para o server.js
module.exports = router;