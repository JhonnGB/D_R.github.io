const productoEscogido = {};
const { default: mongoose } = require("mongoose");
const Producto = require("../models/Products");
const Carrito = require("../models/Carrito");
const Category = require("../models/Category");

productoEscogido.añadirPorducto = async (req, res) => {
  try {
    const id = req.params.id;
    const ObjectId = mongoose.Types.ObjectId;
    let producto = await Producto.findOne({ _id: new ObjectId(id) });

    if (producto) {
      res.render("pages/añadir-producto", { producto } );
    } else {
      console.error("producto no encontrado");
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el producto", error);
    res.status(500).send("Error al obtener el producto");
  }
};

productoEscogido.guardarProducto = async (req, res, next) => {
  // verificación de usuario autenticado
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  };

  // verificacion de productId y cantidad
  const { productId, cantidad } = req.body;
  if (!productId || !cantidad || isNaN(cantidad)) {
    req.flash('errors', 'Datos de producto inválidos.');
    return next();
  };

  try {
    const userId = req.user.userId;
    const pedidoExistente = await Carrito.findOne({ productoId: productId, userId: userId });
    
    console.log('llegamos hasta qui', userId);
    if (!pedidoExistente) {
      const newCarrito = new Carrito({
        userId: userId,
        productoId: productId,
        cantidadProducto: cantidad,
      });

      await newCarrito.save();
      console.log("Producto añadido al carrito.");
      req.flash("success", "Producto añadido al carrito.");

    } else {
      pedidoExistente.cantidadProducto += parseInt(cantidad);
      await pedidoExistente.save();
      console.log("Cantidad actualizada en el carrito");
      req.flash("success", "Pedido Actualizado.");
    }

    next();
  } catch (error) {
    console.error("Error al guardar el producto", error);
    req.flash("errors", "Error al guardar el producto.");
    next();
  }
  // const returnTo = req.session.returnTo || "/";
  // res.redirect(returnTo);
};

// productoEscogido.mostrarProducto = async (req, res) => {
//   const categorias = await Category.find();

//   try {
//     const productoIds = await Carrito.distinct("productoId");
//     if (productoIds.length === 0) {
//       console.log("No se ha añadido ningún producto al carrito de compras");
//       return res.render("pages/carrito", { productosAñadidos: [], categorias });
//     }
//     const productosAñadidos = await Producto.find({
//       _id: { $in: productoIds },
//     });
//     res.render("pages/carrito", { productosAñadidos, categorias });
//   } catch (error) {
//     console.error(error);
//     console.log("Error al obtener productos del carrito de compras");
//   }
// };

module.exports = productoEscogido;