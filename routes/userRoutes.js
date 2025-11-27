const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuth } = require('../middlewares/auth');

router.get('/painel', ensureAuth, userController.getUserPanel);
router.post('/painel/atualizar', ensureAuth, userController.postUpdateProfile);
router.post('/painel/deletar', ensureAuth, userController.postDeleteAccount);

module.exports = router;