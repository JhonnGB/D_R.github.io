const categoryControllers = {}
const Category = require("../models/Category");

categoryControllers.findCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.locals.categories = categories;
        next();
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).send("Error al obtener las categorías");
    }
}

module.exports = categoryControllers;