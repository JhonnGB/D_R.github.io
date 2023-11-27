const productoEscogido = {};
const Producto = require("../models/Products");
const Carrito = require("../models/Carrito");
const Category = require("../models/Category");
const Pedido = require('../models/Pedido')

productoEscogido.mostrarProducto = async (req, res) => {
  // Verificar si hay un usuario autenticado
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  }

  // llamado de categorias
  const categorias = await Category.find();

  try {
    // traer los datos generales de los pedidos realizados
    const datosPedido = await Pedido.find({ userId: req.user.userId });

    // Extraer los datos de los productos de cada pedido
    let productosPedidos = []
    datosPedido.forEach(pedido => {
      const productos = pedido.productosPedidos;
      productosPedidos = productosPedidos.concat(productos);
    });

// console.log('estos son los los Productos pedidos: ', productosPedidos );

    // trae los datos de los productos segun el "Carrito"
    const datosProductos = await Carrito.find({ userId: req.user.userId });
    
    // Extraer todos los productoId
    const productoIds = datosProductos.map(item => item.productoId);

    // Trae los datos de los productos segun "Producto"
    const productosAñadidos = await Producto.find({ _id: { $in: productoIds } })
    

    if (datosProductos.length === 0) {
      console.log("No se han añadido productos al carrito de compras");
      return res.render("pages/carrito", {
        productosAñadidos: [],
        datosProductos: [],
        categorias,
        datosPedido: datosPedido || [],
        productosPedidos: productosPedidos || [],
        errorsMessage: req.flash("errors"),
        successMessage: req.flash("success"),
      });
    }

    res.render("pages/carrito", {
      productosAñadidos,
      datosProductos,
      categorias,
      datosPedido: datosPedido || [],
      productosPedidos: productosPedidos || [],
      successMessage: req.flash("success"),
      errorsMessage: req.flash("errors"),
    });

  } catch (error) {
    console.error("Error al obtener productos del carrito de compras", error);
    req.flash("errors", "Error al cargar el carrito");
    res.redirect("/");
  }
};

productoEscogido.borrarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const productoBorrar = await Carrito.findOneAndDelete({ productoId: id, userId: req.user.userId });

    if (!productoBorrar) {
      console.log("No se encontro el producto en la BD");
      req.flash("errors", "Error al borrar el producto.");
    } else {
      console.log("producto borrado con exito ", productoBorrar.productoId);
      req.flash("success", "Producto borrado con exito.");
    }

    res.redirect("/carrito");
  } catch (error) {
    console.log("Ocurrio un error al borrar el producto: ", error);
    req.flash("errors", "Error al borrar el producto.");
  }
};

module.exports = productoEscogido;