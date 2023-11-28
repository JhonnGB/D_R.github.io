const { Router } = require('express')
const router = Router();

// Importacion de funciones y controladores
const { mostrarProducto, borrarProducto } = require('../controllers/carrito.controller')
// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

router.get('/carrito', authenticateToken, mostrarProducto);

router.get("/carrito/borrar/:id", authenticateToken, borrarProducto);


module.exports = router;