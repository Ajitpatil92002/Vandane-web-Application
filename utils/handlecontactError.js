//handle error Auth
module.exports.handleContactError = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", message: "", phone: "" };

  // validation error
  if (err.message.includes("contact validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  // dublicate error code
  if (err.code === 11000) {
    if (Object.keys(err.keyPattern).includes("username")) {
      errors.username = "Username is Already registered";
    }
    if (Object.keys(err.keyPattern).includes("email")) {
      errors.email = "Email is Already registered";
    }

    return errors;
  }

  return errors;
};
