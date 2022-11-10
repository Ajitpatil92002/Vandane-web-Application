const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  sendRestPasswordMail,
  sendVerifyEmail,
} = require("../utils/sendEmails");
const { handleError } = require("../utils/handleerror");

const maxAge = 24 * 60 * 60;
module.exports.register_get = (req, res) => {
  res.render("./auth/signup");
};

module.exports.register_post = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const user = new User({
      email,
      username,
      password,
      phone,
    });
    await user.save();
    const authVerifytoken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET + user.password,
      { expiresIn: "1h" }
    );
    sendVerifyEmail(authVerifytoken, email, user._id);
    res.status(200).json({ msg: "/auth/verifyemail" });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.verifyAccount = async (req, res) => {
  const { token, id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, {
      $set: {
        isVerified: true,
      },
    });
    if (!user) {
      return res.status(404).render("./error/404");
    }
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    res.render("./auth/verifyAccount");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};
module.exports.login_get = async (req, res) => {
  res.status(200).render("./auth/login");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const UserVerify = await User.findOne({ email });
    if (UserVerify) {
      if (UserVerify.isVerified === false) {
        let errors = {
          username: "",
          email: "Please enter valid email",
          password: "",
        };
        return res.render("./auth/login", { errors });
      }
    }
    const user = await User.login(email, password);
    const Token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    res.cookie("Auth_Token", Token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.user = user._id;
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    // res.render("login", { errors });
    res.status(400).json({ errors });
  }
};

module.exports.forgetpassword_get = async (req, res) => {
  res.render("./auth/forgotpassword");
};

module.exports.forgetpassword_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.send({ msg: "You Email is not register ,Please SignIN" });
      return;
    }
    const { _id } = user;
    const Token = jwt.sign({ _id }, process.env.JWT_SECRET + user.password, {
      expiresIn: "1h",
    });
    sendRestPasswordMail(Token, user.email, _id);
    res.status(200).json({
      msg: `Please, Reset your Password link has been Sent to your Gmail Account :- ${user.email}`,
    });
  } catch (err) {
    res.status(400).json({ msg: "You Email is not register ,Please SignIN" });
  }
};

module.exports.resetPassword_get = async (req, res) => {
  const { token, id } = req.params;
  try {
    const user = await User.findById(id);
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    res.render("./auth/resetpassword", { email: user.email });
  } catch (err) {
    res.status(404).render("./error/404");
  }
};

module.exports.resetPassword_post = async (req, res) => {
  try {
    const { token, id } = req.params;
    const user = await User.findById(id);
    jwt.verify(token, process.env.JWT_SECRET + user.password);
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(id, {
      $set: {
        password: hashpassword,
      },
    });
    res.status(200).json({ msg: "Password is Reseted" });
  } catch (err) {
    res.status(404).render("./error/404");
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("Auth_Token", "", { maxAge: 1 });
  res.redirect("/");
};
