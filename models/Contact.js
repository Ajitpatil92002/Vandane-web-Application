const mongoose = require("mongoose");

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter name"],
    maxlength: [50, "Name must maxlength of 50 character"],
    minlength: [2, "Name  must minlength of 2 character"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    validate: [isValidEmail, "please enter valid email"],
    maxlength: [50, "password  must minlength of 50 character"],
  },
  phone: {
    type: String,
    required: [true, "please enter phone"],
    maxlength: [12, "password  must maxlength of 12 character"],
    minlength: [10, "password  must minlength of 10 character"],
  },
  message: {
    type: String,
    required: [true, "please enter message"],
    maxlength: [500, "message  must maxlength of 500 character"],
    minlength: [10, "message  must minlength of 10 character"],
  },
});

const contact = mongoose.model("contact", contactSchema);

module.exports = contact;
