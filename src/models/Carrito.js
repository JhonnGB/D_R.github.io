const { Schema, model } = require('mongoose');

const CarritoSchema = new Schema({
    userId: {type: String},
    productoId: {type: String},
    cantidadProducto: {type: Number},
    adicionales: [{type: String}],
}, {
    timestamps: true
});

module.exports = model('Carrito', CarritoSchema);