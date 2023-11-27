const nodemailer = require("nodemailer");
const realizarPago = {};
const Producto = require("../models/Products");
const Carrito = require("../models/Carrito");
const Category = require("../models/Category");
const User = require("../models/User");
const Pedido = require("../models/Pedido");

realizarPago.renderFormPago = async (req, res) => {
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  }

  const categorias = await Category.find();
  const userId = req.user.userId;

  try {
    const userData = await User.findOne({ _id: userId });
    // console.log(userData);
    if (!userData) {
      console.log("Error, usuario no encontrado");
      req.flash("errors", "Usuario Invalido");
      res.clearCookie("authToken");
      return res.redirect("/");
    }

    const productoIds = await Carrito.distinct("productoId", {
      userId: req.user.userId,
    });

    if (productoIds.length === 0) {
      console.log("No se han añadido productos al carrito de compras");
      req.flash("errors", "Error al realizar la compra");
      return res.render("pages/carrito", { productosAñadidos: [], categorias });
    }

    const productosAñadidos = await Producto.find({
      _id: { $in: productoIds },
    });
    const datosProductos = await Carrito.find({ userId: req.user.userId });

    res.render("pages/pago", { userData, productosAñadidos, datosProductos });
  } catch (error) {
    console.error("Error al cargar el formulario de pago", error);
    req.flash("errors", "Error al realizar la compra");
    res.redirect("/");
  }
};

// --------------------------------------------------------------------------------

// Función para enviar correos electrónicos
const enviarCorreo = async (destinatario, asunto, contenido) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const correo = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    html: contenido,
  };

  try {
    await transporter.sendMail(correo);
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    // Tratar el error según sea necesario
  }
};


const procesarPedido = async (productosAñadidos, {
  userId,
  formaEntrega,
  localDireccion,
  personaRecibe,
  direccionUsuario,
  totalSum,
  formaPago,
  nombres,
  email,
  numCel,
  numIdentidad,
  infoAdicional
}, req, res) => {
try {
  // crea el pedido
  const guardarPedido = new Pedido({
    userId: userId,
    cliente: personaRecibe,
    numIdentidad: numIdentidad,
    formaEntrega: formaEntrega,
    direccionUsuario: direccionUsuario || '',
    productosPedidos: productosAñadidos,
    total: totalSum,
  });
  // Guardar el pedido en la base de datos
  await guardarPedido.save();
  console.log('Pedido guardado exitosamente.');

  // Generar Corres electronicos
  const contenidoCorreoEmpresa = `
      <p style="font-weight: bold;">Orden:</p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${productosAñadidos
            .map(
              (producto) => `
            <tr>
              <td>${producto.nombreProd}</td>
              <td>$ ${producto.precioProd}</td>
              <td>${producto.cantidadProd}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    
      <br>
    
      <hr>
    
      <p style="font-weight: bold;">Información del pedido:</p>
      <ul>
        <li><strong>Forma de entrega:</strong> ${formaEntrega}</li>
        <li><strong>Local:</strong> ${localDireccion}</li>
        <li><strong>Persona a cargo:</strong> ${personaRecibe}</li>
        <li><strong>Dirección de entrega:</strong> ${
          direccionUsuario ? direccionUsuario : "No aplica"
        }</li>
        <li><strong>Forma de pago:</strong> ${formaPago}</li>
        <li><strong>Total a Pagar:</strong>$ ${totalSum}</li>
      </ul>
    
      <hr>
    
      <p style="font-weight: bold;">Información Adicional:</p>
      <p>${infoAdicional ? infoAdicional : "No aplica"}</p>
    
      <hr>
    
      <p style="font-weight: bold;">Información de contacto:</p>
      <ul>
        <li><strong>Nombre:</strong> ${nombres}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Teléfono celular:</strong> ${numCel}</li>
        <li><strong>Identificación:</strong> ${numIdentidad}</li>
      </ul>
    `;

  const contenidoCorreoUsuario = `
      <p style="font-weight: bold;">Pedido Realizado Con Éxito</p>
      <p>Gracias Por Preferirnos.</p>
      <hr>
    
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${productosAñadidos
            .map(
              (producto) => `
            <tr>
              <td>${producto.nombreProd}</td>
              <td>$ ${producto.precioProd}</td>
              <td>${producto.cantidadProd}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tbody>
          <tr>
            <td colspan="3">
              <p style="font-weight: bold;">Información del pedido:</p>
              <ul>
                <li><strong>Forma de entrega:</strong> ${formaEntrega}</li>
                <li><strong>Local:</strong> ${localDireccion}</li>
                <li><strong>Persona a cargo:</strong> ${personaRecibe}</li>
                <li><strong>Dirección de entrega:</strong> ${
                  direccionUsuario ? direccionUsuario : "No aplica"
                }</li>
                <li><strong>Forma de pago:</strong> ${formaPago}</li>
                <li><strong>Total a Pagar:</strong>$ ${totalSum}</li>
              </ul>
    
              <p style="font-weight: bold;">Información Adicional:</p>
              <p>${infoAdicional ? infoAdicional : "No aplica"}</p>
    
              <p style="font-weight: bold;">Sus Datos de Contacto:</p>
              <ul>
                <li><strong>Nombre:</strong> ${nombres}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefono celular:</strong> ${numCel}</li>
                <li><strong>Identificación:</strong> ${numIdentidad}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    
      <br>
      <hr>
      <br>
      <br>
      <br>
      <p style="font-weight: bold;">Delicias Rápidas</p>
      <p>Queremos darte la mejor atención. Conócenos</p>
    `;
        
  await enviarCorreo(process.env.EMAIL_USER, "Nuevo Pedido", contenidoCorreoEmpresa);
  await enviarCorreo(email, "Pedido Realizado", contenidoCorreoUsuario);

  return true;

} catch (error) {
  console.error("Error al procesar el pedido:", error);
  req.flash("errors", "Error al procesar el pedido.");
  return res.redirect('/carrito')
}
};


// controlador principal
realizarPago.ejecucionPago = async (req, res) => {
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  }

  try {
    const {
      nombres,
      email,
      numCel,
      numIdentidad,
      formaEntrega,
      localDireccion,
      personaRecibe,
      infoAdicional,
      direccionUsuario,
      totalSum,
      formaPago,
      // solicitudCambio,
      nombreProd,
      precioProd,
      cantidadProd,
      // productos,
    } = req.body;

    // console.log("req.body:", req.body);
    const userId = req.user.userId;
    const usuarioActual = await User.findOne({ _id: userId });

    if (!usuarioActual) {
      console.log("Error, usuario no encontrado");
      req.flash("errors", "Error, su sesión a expirado");
      res.clearCookie("authToken");
      return res.redirect("/login");
    }

    if (!personaRecibe || !numIdentidad || !formaEntrega || !totalSum) {
      console.log("Error, los campos no estan diligenciados.");
      req.flash("errors", "Error al ejecutar el pago.");
      return res.redirect("/carrito");
    }

    const idsDeProductos = await Carrito.distinct("productoId", { userId });

    if (idsDeProductos.length === 0) {
      console.log("No se han encontrado los productos del carrito.");
      req.flash("errors", "El carrito está vacío. Agregue productos para realizar el pago.");
      return res.redirect("/carrito");
    }

    // Verificar si nombreProd es un array o un valor único
    const nombresArr = Array.isArray(nombreProd) ? nombreProd : [nombreProd];
    const precioArr = Array.isArray(precioProd) ? precioProd : [precioProd];
    const cantidadArr = Array.isArray(cantidadProd)
      ? cantidadProd
      : [cantidadProd];

    // Construir un arreglo de objetos
    const productosAñadidos = nombresArr.map((nombre, index) => ({
      nombreProd: nombre,
      precioProd: precioArr[index],
      cantidadProd: cantidadArr[index],
    }));

    // Ejecutar la funcion procesarPedido (guardar pedido, enviar correos)
    await procesarPedido(productosAñadidos, {
      userId,
      formaEntrega,
      localDireccion,
      personaRecibe,
      direccionUsuario,
      totalSum,
      formaPago,
      nombres,
      email,
      numCel,
      numIdentidad,
      infoAdicional
    }, req, res);

    if (!usuarioActual.numId) {
      usuarioActual.numId = numIdentidad;
      await usuarioActual.save();
    }

    if (!usuarioActual.address) {
      usuarioActual.address = direccionUsuario || '';
      await usuarioActual.save();
    }

    // borrar productos
    await Carrito.deleteMany({ userId: userId });
    console.log('carrito basiado')

    req.flash("success", "Pedido Realizado Con Exito.");
    res.redirect("/carrito");
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    req.flash("errors", "Error al ejecutar el pago.");
    res.status(500).send("Error al procesar el pago");
  }
};

module.exports = realizarPago;