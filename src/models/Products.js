const {Schema, model} = require('mongoose');

const ProductSchema = new Schema({
    // id: { type: String },
    category: {type: String},
    name: {type: String},
    description: {type: String},
    precio: {type: Number},
    cover: {type: String},
    
}, // { timestamps: true } 
)

module.exports = model('Producto', ProductSchema);