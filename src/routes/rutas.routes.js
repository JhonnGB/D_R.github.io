const { Router } = require("express");
const path = require("path");
const router = Router();

// importacion de Middleware de autenticacion
const { authenticateToken } = require("../authentication/auth");

const { findCategories } = require("../controllers/categoryControllers");
const { filtrarProductos } = require("../controllers/productsFilter");
const {
  findCombos,
  filterCombos,
} = require("../controllers/combos.controller");
const {
  añadirPorducto,
  guardarProducto,
} = require("../controllers/añadir.controller");


// Pagina principal
router.get("/", findCategories, (req, res) => {
  const successMessage = req.flash("success")
  const errorsMessage = req.flash("errors")
  res.locals.successMessage = successMessage;
  res.locals.errorsMessage = errorsMessage;
  
  res.render("index", { categories: res.locals.categories });
});

// Productos
router.get(
  "/productos/:category",
  filtrarProductos,
  findCategories,
  (req, res) => {
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

// Combos
router.get("/combos", authenticateToken, findCombos, (req, res) => {
  const successMessage = req.flash("success");
  const selectedGroup = req.params.group;

  res.locals.successMessage = successMessage;
  res.render("pages/combos", {
    combos: res.locals.combos,
    groupsAndIcons: res.locals.groupsAndIcons,
    currentUrl: res.locals.currentUrl,
    selectedGroup,
  });
});

// Combos Filter
router.get("/combos/:group", authenticateToken, findCombos, filterCombos);

// Agregar Producto
router.get("/agregar/:id", authenticateToken, añadirPorducto);
// router.get("/agregar-producto/:id", guardarProducto);
router.post("/agregar-producto/:id", authenticateToken, guardarProducto);


module.exports = router;