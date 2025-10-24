const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/painel', userController.getUserPanel);
router.post('/painel/atualizar', userController.postUpdateProfile);
router.post('/painel/deletar', userController.postDeleteAccount);

module.exports = router;