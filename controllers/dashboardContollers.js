const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../models/User");
const AppStats = require("../models/App");
const contact = require("../models/Contact");

module.exports.dasboard_get = async (req, res) => {
  try {
    const Adminusers = await User.find({ isAdmin: true });
    const users = await User.find({ isAdmin: false });
    const TotalUsers = await User.count();
    res.render("./adminpages/dashboard", {
      Adminusers: Adminusers,
      users: users,
      TotalUsers: TotalUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.changeUserRole = async (req, res) => {
  try {
    const id = req.query.id;
    const value = req.query.isAdmin;
    const user = await User.findByIdAndUpdate(id.replace(" ", ""), {
      $set: {
        isAdmin: value,
      },
    });
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(404).render("./error/404");
        next();
      } else {
        if (decodedToken.id == id) {
          res.cookie("Auth_Token", "", { maxAge: 1 });
        }
      }
    });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.deleteUsers = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findByIdAndDelete(id);
    const token = req.cookies.Auth_Token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(404).render("./error/404");
        next();
      } else {
        if (decodedToken.id == id) {
          res.cookie("Auth_Token", "", { maxAge: 1 });
        }
      }
    });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.stats_create = async (req, res) => {
  try {
    const appStats = await new AppStats({
      downloads: "",
      users: "",
      Pravachans: "",
      Temples: "",
    });
    await appStats.save();
    res.redirect("/admin/stats");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.stats_get = async (req, res) => {
  try {
    let appStats = await AppStats.find();
    appStats = appStats[0];
    res.render("./adminpages/stats", { appStats });
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.stats_post = async (req, res) => {
  try {
    const id = req.params.id;
    const appStats = await AppStats.findByIdAndUpdate(id, {
      $set: {
        ...req.body,
      },
    });

    res.redirect("/admin/stats");
  } catch (err) {
    console.log(err);
    res.status(404).render("./error/404");
  }
};

module.exports.userStatus = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports.contact_get = async (req, res) => {
  try {
    const contacts = await contact.find();
    const TotaContact = await contact.count();
    res.render("./adminpages/contact", { contacts, TotaContact: TotaContact });
  } catch (err) {
    res.json(err);
  }
};

module.exports.contact_delete = async (req, res) => {
  try {
    await contact.findByIdAndDelete(req.params.id);
    res.redirect("/admin/contact");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};
