productoEscogido.guardarProducto = async (req, res, next) => {
    const { productId, cantidad, adicionales } = req.body;
    const userData = req.user.userId;
    console.log("id de usuario: ",userData)
  
    try {
      const pedidoExistente = await Carrito.findOne({ productoId: productId });
  
      if (pedidoExistente) {
        pedidoExistente.cantidadProducto += parseInt(cantidad);
  
        // const acumulacion = pedidoExistente.adicionales.reduce(
        //   (accumulated, adicional) => {
        //     const [count, adicionalName] = adicional.split(" "); 
  
        //     if (adicionales.includes(adicionalName)) {
        //       accumulated[adicionalName] = `${
        //         parseInt(count) + 1
        //       } ${adicionalName}`; 
        //     } else {
        //       accumulated[adicional] = adicional; 
        //     }
        //     return accumulated;
        //   },
        //   {}
        // );
        // adicionales.forEach((adicional) => {
        //   if (acumulacion[adicional]) {
        //     const [count, adicionalName] = acumulacion[adicional].split(" "); // Obtener el contador y el nombre del adicional
        //     acumulacion[adicional] = `${parseInt(count) + 1} ${adicionalName}`; // Incrementar el contador si el adicional ya existe
        //   } else {
        //     acumulacion[adicional] = `1 ${adicional}`; // Agregar el adicional con contador 1 si es nuevo
        //   }
        // });
  
        // const adicionalesUpdate = Object.values(acumulacion);
  
        // console.log(adicionalesUpdate);
  
        // pedidoExistente.adicionales = adicionalesUpdate.join(", ");
  
        await pedidoExistente.save();
  
        console.log("Cantidad actualizada en el carrito");
        req.flash("success", "Pedido Actualizado.");
      } else {
        // const newAdicionales = adicionales.map((adicional) => `1 ${adicional}`);
        // console.log(newAdicionales);
        const newCarrito = new Carrito({
          productoId: productId,
          cantidadProducto: cantidad,
          // adicionales: newAdicionales,
        });
  
        await newCarrito.save();
  
        console.log("Producto añadido al carrito:");
        req.flash("success", "Producto añadido al carrito.");
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


  //  opcion 2 ---------------------------------
  const enviarCorreoConDetalles = async (req, res) => {
    try {
        // Lógica para obtener los productos y la información adicional (cambiar según tu aplicación)
        const productoIds = await Carrito.distinct("productoId", { userId: req.user.userId });
        const productosAñadidos = await Producto.find({ _id: { $in: productoIds } });
        const datosProductos = await Carrito.find({ userId: req.user.userId });

        // Construir el mensaje de correo con los detalles de los productos y sus cantidades
        let correoHTML = `
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
        `;

        productosAñadidos.forEach(producto => {
            const cantidadProducto = datosProductos.find(prod =>
                prod.productoId.toString() === producto._id.toString()
            );

            const cantidad = cantidadProducto ? cantidadProducto.cantidadProducto : 0;

            correoHTML += `
                <tr>
                    <td>${producto.name}</td>
                    <td>${producto.precio}</td>
                    <td>${cantidad}</td>
                </tr>
            `;
        });

        correoHTML += `
                </tbody>
            </table>
        `;

        // Aquí deberías enviar el correo con el contenido construido
        // Ejemplo: enviarCorreo(usuario.email, 'Detalles del pedido', correoHTML);

        // Respuesta o redirección después de enviar el correo
        res.send('Correo enviado con los detalles del pedido');
    } catch (error) {
        console.error("Error al obtener los productos y datos adicionales para el correo", error);
        res.status(500).send('Error al enviar el correo');
    }
};

module.exports = { enviarCorreoConDetalles };


// controlador pago ----------------------------------------------------------- 

realizarPago.ejecucionPago = async (req, res) => {
  if (!req.user) {
    req.flash("errors", "Por favor, inicie sesión para continuar.");
    res.clearCookie("authToken");
    return res.redirect("/login");
  }

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

  try {
    // console.log("req.body:", req.body);
    const userId = req.user.userId;
    const usuarioActual = await User.findOne({ _id: userId });

    if (!usuarioActual) {
      console.log("Error, usuario no encontrado");
      req.flash("errors", "Error, su sesión a expirado");
      res.clearCookie("authToken");
      return res.redirect("/login");
    }

    if (
      !personaRecibe ||
      !numIdentidad ||
      !formaEntrega ||
      !productosAñadidos ||
      !totalSum
    ) {
      console.log("Error, los campos no estan diligenciados.");
      req.flash("errors", "Error al ejecutar el pago.");
      return res.redirect("/carrito");
    }

    const idsDeProductos = await Carrito.distinct("productoId", { userId });

    if (idsDeProductos.length === 0) {
      console.log("No se han encontrado los productos del carrito.");
      req.flash(
        "errors",
        "El carrito está vacío. Agregue productos para realizar el pago."
      );
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

    const guardarPedido = new Pedido({
      cliente: personaRecibe,
      numIdentidad: numIdentidad,
      formaEntrega: formaEntrega,
      direccionUsuario: direccionUsuario,
      productosPedidos: productosAñadidos,
      total: totalSum,
    });

    await guardarPedido.save();
    console.log("Pedido guardado exitosamente.");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mensajepedidoEmpresa = `
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
                <td>${producto.precioProd}</td>
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

    const pedidoEmpresa = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nuevo Pedido",
      html: mensajepedidoEmpresa,
    };

    const msgCorreoConfirUser = `
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
                <td>${producto.precioProd}</td>
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

    const correoConfirUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Pedido Realizado.",
      html: msgCorreoConfirUser,
    };

    transporter.sendMail(pedidoEmpresa, function (error, info) {
      if (error) {
        console.log(error);
        req.flash("errors", "Se a producido un error al hacer el envio.");
      } else {
        console.log("Pedido enviado a la empresa: " + info.response);
        // envio de correo a usuario
        transporter.sendMail(correoConfirUser, function (error, info) {
          if (error) {
            console.log(
              "Error al enviar el correo de pedido al usuario",
              error
            );
          } else {
            console.log(
              "Email de confirmacion enviado al usuario: " + info.response
            );
            req.flash("success", "Pedido Realizado.");
          }
        });
      }
    });

    if (!usuarioActual.numId) {
      usuarioActual.numId = numIdentidad;
      await usuarioActual.save();
    }

    if (!usuarioActual.address) {
      usuarioActual.address = direccionUsuario;
      await usuarioActual.save();
    }

    // borrar productos
    Carrito.findOneAndDelete({ productoId: idsDeProductos });

    res.redirect("/carrito");
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    req.flash("errors", "Error al ejecutar el pago.");
    res.status(500).send("Error al procesar el pago");
  }
};


// 

// <!-- funciones editar, eliminar -->
    // <div class="productos-añadidos__funciones">
    //     <a href="javascript:void(0);" onclick="editarProducto('<%= producto._id %>')">
    //         <img class="productos-añadidos__funciones-aditar" src="../icons/editar.png" alt="editar">
    //     </a>
    //     <a href="javascript:void(0);" onclick="eliminarProducto('<%= producto._id %>')">
    //         <img class="productos-añadidos__funciones-eliminar" src="../icons/borrar.png" alt="eliminar">
    //     </a>
    // </div>

    



// passport.js
// const jwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

// const User = require('../models/User');

// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET,
// };

// module.exports = passport => {
//   passport.use(
//     new jwtStrategy(opts, async (jwt_payload, done) => {
//       try {
//         const user = await User.findById(jwt_payload.userId);

//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       } catch (error) {
//         return done(error, false);
//       }
//     })
//   );
// };