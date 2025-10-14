const express = require('express');
const router = express.Router();

// Importa o controller
const pageController = require('../controllers/pageController');

// Define as rotas e associa cada uma a uma função do controller
router.get('/', pageController.getHomePage);
router.get('/faq', pageController.getFaqPage);
router.get('/login', pageController.getLoginPage);
router.get('/register', pageController.getRegisterPage);
router.get('/image-to-pdf', pageController.getImageToPdf);
router.get('/combinar-pdf', pageController.getCombinarPdf);

// Exporta o router para o server.js
module.exports = router;