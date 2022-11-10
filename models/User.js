const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "please enter username"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please enter email"],
      validate: [isValidEmail, "please enter valid email"],
    },
    password: {
      type: String,
      unique: true,
      required: [true, "please enter password"],
      minlength: [6, "password length must minlength of 6 character"],
    },
    phone: {
      type: String,
      maxlength: [12, "password length must maxlength of 12 character"],
      minlength: [10, "password length must minlength of 10 character"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const found = await bcrypt.compare(password, user.password);
    if (found) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
