require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require('connect-flash');

const sessionSecret = process.env.JWT_SECRET;
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

// Inicializacion
const app = express();
const port = process.env.PORT || 3000;

// Conexión a BD
require("./database");

// Middleware - Configuracion de express-session
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Configura connect-flash
app.use(flash());

// Middleware para configurar mensajes de sesión
app.use((req, res, next) => {
  res.locals.successMessage = [];
  res.locals.errorsMessage = [];
  res.locals.errorsText = [];
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('dev'));
app.use(
  morgan(":method :url :status :response-time ms -", {
    skip: (req, res) => {
      return (
        req.url.startsWith("/icons/") ||
        req.url.startsWith("/img/") ||
        req.url.startsWith("/css/") ||
        req.url.startsWith("/js/")
      );
    },
  })
);

app.use(methodOverride("_method"));
app.use(cookieParser());

// Varibles Globales
app.use((req, res, next) => {
  res.locals.user = res.user || null;
  token = req.cookies.authToken;
  next();
});

// Motor de plantilla EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

// Archivos estaticos
app.use(express.static(__dirname + "/public"));

// Routes
app.use(require("./routes/rutas.routes"));
app.use(require("./routes/about.routes"));
app.use(require("./routes/users.routes"));
app.use(require("./routes/carrito.routes"));
// app.use(require('./routes/product.routes'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ${port} en funcionamiento`);
});
