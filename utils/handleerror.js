//handle error Auth
module.exports.handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { username: "", email: "", password: "", phone: "" };

  if (err.message === "incorrect password") {
    errors.password = "password is incorrect";
  }
  if (err.message === "incorrect email") {
    errors.email = "incorrect email";
  }

  // validation error
  if (err.message.includes("user validation failed")) {
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

//handle error Auth
module.exports.handleTempleError = (err) => {
  console.log(err.message, err.code);
  let errors = { title: "", discription: "", content: "", thumbnail: "" };

  // validation error
  if (err.message.includes("temples validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  // dublicate error code
  if (err.code === 11000) {
    if (Object.keys(err.keyPattern).includes("username")) {
      errors.title = "title is Already existing";
    }
    return errors;
  }

  return errors;
};
