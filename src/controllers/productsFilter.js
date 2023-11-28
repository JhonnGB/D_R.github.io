const productsFilter = {};
const Producto = require('../models/Products')

productsFilter.filtrarProductos = async (req, res, next) => {
    const category = req.params.category;
    const currentUrl = req.url;

    // req.session.returnTo = req.originalUrl;
    
    if(currentUrl == '/productos/todos'){
        // console.log(currentUrl)
        let productos = await Producto.find({});
        res.locals.productos = productos;
        res.locals.isTodosActive = true;
        res.locals.returnTo = req.session.returnTo;
    } 
    else if(category) {
        let productos = await Producto.find({ category: category });
        res.locals.productos = productos;
        res.locals.returnTo = req.session.returnTo;
        // console.log('posición anterior: ', res.locals.returnTo)
    }
    next();
}

module.exports = productsFilter;