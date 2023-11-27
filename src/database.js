const mongoose = require('mongoose');

const { DELICIAS_RAPIDAS_MONGODB_HOST, DELICIAS_RAPIDAS_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${DELICIAS_RAPIDAS_MONGODB_HOST}/${DELICIAS_RAPIDAS_MONGODB_DATABASE}`

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log('Base de datos Conectada'))
    .catch(err => console.log(err));