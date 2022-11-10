const dotenv = require("dotenv");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

dotenv.config();

const requiredAuth = (req, res, next) => {
  const token = req.cookies.Auth_Token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.redirect("/auth/login");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  requiredAuth(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(404).render("./error/404");
    }
  });
};

const verifyTokenAdmin = (req, res, next) => {
  requiredAuth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(404).render("./error/404");
    }
  });
};

const checkUser = (req, res, next) => {
  try {
    const token = req.cookies.Auth_Token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          if (user === null) {
            return res.status(404).render("./error/404");
          }
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(404).render("./error/404");
  }
};

module.exports = {
  requiredAuth,
  verifyTokenAdmin,
  verifyTokenAndAuthorization,
  checkUser
};
