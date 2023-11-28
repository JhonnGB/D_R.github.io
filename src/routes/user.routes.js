const { Router } = require('express')
const router = Router();

// Importacion de funciones y controladores
const { renderRegisterForm, register, renderLoginForm, login, logout } = require('../controllers/users.controller');

router.get('/register', renderRegisterForm);

router.post('/register', register)

router.get('/login', renderLoginForm);

router.post('/login', login)

router.get('/logout', logout)


module.exports = router;