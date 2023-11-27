const { Router } = require('express')
const router = Router();

// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

const { mostrarProducto, borrarProducto } = require('../controllers/carrito.controller')
const { renderFormPago, ejecucionPago } = require('../controllers/pago.controller')

router.get('/carrito', authenticateToken, mostrarProducto);

router.get("/carrito/borrar/:id", authenticateToken, borrarProducto);

router.get('/realizar-pago', authenticateToken, renderFormPago)

router.post('/ejecucion-pago', authenticateToken, ejecucionPago);

module.exports = router;