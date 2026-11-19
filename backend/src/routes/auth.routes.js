// Rotas publicas de autenticacao (nao exigem token).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');

router.post('/register', ctrl.registrar); // cadastro de cliente
router.post('/cadastro', ctrl.registrar); // idem (aceita os dois nomes)
router.post('/login', ctrl.login);        // login

module.exports = router;
