const { Router } = require('express')
const router = Router();

const { enviarMensaje } = require('../controllers/correo.controller')

router.get('/estamosAqui', (req, res) => {
    res.render('pages/estamos_aqui')
});

router.get('/nosotros', (req, res) => {
    res.render('pages/nosotros')
});

router.post('/enviarcorreo', enviarMensaje)

module.exports = router;