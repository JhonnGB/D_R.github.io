const { Router } = require("express");
const router = Router();

// Importacion de funciones y controladores
const { findCategories } = require("../controllers/categoryControllers");
const { filtrarProductos } = require("../controllers/productsFilter");
const { añadirPorducto, guardarProducto } = require("../controllers/añadir.controller");
// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

// Productos
router.get("/productos/:category", filtrarProductos, findCategories, (req, res) => {
    const { productos, categories, isTodosActive } = res.locals;
    const successMessage = req.flash("success");
    const errorsMessage = req.flash("errors");
    const selectedCategory = req.params.category;

    res.render("pages/productos", {
      productos,
      categories,
      successMessage,
      errorsMessage,
      selectedCategory,
      isTodosActive,
    });
  }
);

// Renderizar vista para añadir producto
router.get("/agregar/:id", authenticateToken, añadirPorducto);

// Añadir producto al carrito de comrpas
router.post("/agregar-producto/:id", authenticateToken, guardarProducto);


module.exports = router;