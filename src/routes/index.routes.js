const { Router } = require("express");
const router = Router();

// Importacion de funciones y controladores
const { findCategories } = require("../controllers/categoryControllers");

// Pagina principal
router.get("/", findCategories, (req, res) => {
  const successMessage = req.flash("success")
  const errorsMessage = req.flash("errors")
  res.locals.successMessage = successMessage;
  res.locals.errorsMessage = errorsMessage;
  
  res.render("index", { categories: res.locals.categories });
});


module.exports = router;