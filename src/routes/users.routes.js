const { Router } = require('express')
// const path = require('path');
const router = Router();

const { renderRegisterForm, register, renderLoginForm, login, logout } = require('../controllers/users.controller')

router.get('/register', renderRegisterForm);

router.post('/register', register)

router.get('/login', renderLoginForm);

router.post('/login', login)

router.get('/logout', logout)

module.exports = router;