const contact = require("../models/Contact");
const { handleContactError } = require("../utils/handlecontactError");

module.exports.contact_post = async (req, res) => {
  try {
    const contacts = new contact({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
    });
    await contacts.save();
    res.json({ msg: "success" });
  } catch (err) {
    const errors = handleContactError(err);
    res.status(400).json({ errors });
  }
};