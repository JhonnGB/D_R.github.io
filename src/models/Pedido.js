const { Schema, model } = require("mongoose");

const PedidoSchema = new Schema(
  {
    userId: { type: String },
    cliente: { type: String },
    numIdentidad: { type: String },
    formaEntrega: { type: String },
    direccionUsuario: { type: String },
    productosPedidos: [
      {
        nombreProd: String,
        precioProd: Number,
        cantidadProd: Number,
      },
    ],
    total: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Pedido", PedidoSchema);
