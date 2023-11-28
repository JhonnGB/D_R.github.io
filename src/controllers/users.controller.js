const usersCtrl = {};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

usersCtrl.renderRegisterForm = (req, res) => {
  res.render("pages/users/register");
};

usersCtrl.register = async (req, res) => {
  const { name, lastName, cel, birthdate, email, password, confirm_password } =
    req.body;

  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    req.flash("errText", "El correo ya se encuntra registrado.");
    res.render("pages/users/register", {
      errorsText: req.flash("errText"),
      name,
      lastName,
      cel,
      birthdate,
    });
    return;
  }

  if (password.length < 6) {
    req.flash("errText", "La contraseña requiere al menos 6 caracteres.");
  }
  if (password != confirm_password) {
    req.flash("errText", "Las contraseñas ingresadas no coinciden.");
  }
  const errorsText = req.flash("errText");
  if (errorsText.length > 0) {
    res.render("pages/users/register", {
      errorsText,
      name,
      lastName,
      cel,
      birthdate,
      email,
    });
  } else {
    const newUser = new User({
      name,
      lastName,
      cel,
      birthdate,
      email,
      password,
    });
    try {
      newUser.password = await newUser.encrypPassword(password);
      await newUser.save();
      req.flash("success", "Su Registro Fue Exitoso.");
      res.render("pages/users/login", {
        successMessage: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  }
};

usersCtrl.renderLoginForm = (req, res) => {
  res.render("pages/users/login");
};

usersCtrl.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      req.flash("errText", "Correo o contraseña incorrecta.");
      res.render("pages/users/login", { errorsText: req.flash("errText") });
    } else {
      // Genera un token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      req.flash("success", "Inicio de Sesión exitoso.");

      const returnTo = req.session.returnTo || "/";
      res.cookie("authToken", token);
      res.redirect(returnTo);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
  next();
};

usersCtrl.logout = (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/");
};

module.exports = usersCtrl;