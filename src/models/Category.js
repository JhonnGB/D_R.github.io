const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
    category: {type: String},
    numProducts: {type: Number},
    cover: {type: String},
    icono: {type: String},
});

module.exports = model('Category', CategorySchema);