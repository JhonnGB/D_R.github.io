const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    req.flash('errors', 'Por favor, inicie sesión para continuar.');

    req.session.returnTo = req.originalUrl;
    return res.render('pages/users/login', { errorsMessage: req.flash('errors') });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.flash('errors', 'Sesión Expirada, por favor inicie sesión.');
      return res.render('pages/users/login', { errorsMessage: req.flash('errors') });
    }
    
    req.user = user;
    delete req.session.returnTo;
    next();
  });
}

module.exports = {
  authenticateToken,
};