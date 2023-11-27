const {Schema, model} = require('mongoose');

const ComboSchema = new Schema ({
    group: {type: String},
    name: {type: String},
    description: {type: String},
    precio: {type: Number},
    cover: {type: String},
    icono: {type: String},
});

module.exports = model('Combo', ComboSchema);