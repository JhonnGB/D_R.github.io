const { Router } = require('express')
const router = Router();

// Importacion de funciones y controladores
const { renderFormPago, ejecucionPago } = require('../controllers/pago.controller')
// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

router.get('/realizar-pago', authenticateToken, renderFormPago);

router.post('/ejecucion-pago', authenticateToken, ejecucionPago);


module.exports = router;