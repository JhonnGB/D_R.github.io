require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sessionSecret = process.env.JWT_SECRET;
const methodOverride = require("method-override");
const flash = require('connect-flash');
const morgan = require("morgan");

// Inicializacion
const app = express();
const port = process.env.PORT || 3000;

// Conexión a BD
require("./database");

//                           -----  Configuracion de Middlewares  -----
// Configuracion de express-session
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Configura connect-flash
app.use(flash());

// Middleware para configurar mensajes
app.use((req, res, next) => {
  res.locals.successMessage = [];
  res.locals.errorsMessage = [];
  res.locals.errorsText = [];
  next();
});

// Otros Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// configuracion de Morgan
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

// Varibles Globales
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  token = req.cookies.authToken;
  next();
});

// Motor de plantilla EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

// Archivos estaticos
app.use(express.static(__dirname + "/public"));

// Routes
app.use(require("./routes/index.routes"));
app.use(require("./routes/empresa.routes"));
app.use(require("./routes/productos.routes"));
app.use(require("./routes/user.routes"));
app.use(require("./routes/carrito.routes"));
app.use(require("./routes/pago.routes"));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ${port} en funcionamiento`);
});