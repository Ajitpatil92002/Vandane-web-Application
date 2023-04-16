const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const home_Route = require("./routes/home");
const admin_route = require("./routes/admin");
const auth_Route = require("./routes/auth");
const pravachanRoute = require("./routes/api");
const { checkUser, verifyTokenAdmin } = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB is Connected");
  }
});

// Template engine Set up
app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.use("/", checkUser, home_Route);
app.use("/api",pravachanRoute)
app.use("/admin", verifyTokenAdmin, checkUser, admin_route);
app.use("/auth", checkUser, auth_Route);
app.all("*", (req, res) => {
  res.status(404).render("./error/404");
});
app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});