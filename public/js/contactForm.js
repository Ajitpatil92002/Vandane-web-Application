const form = document.querySelector("form");
const emailerror = document.getElementById("emailerror");
const nameerror = document.getElementById("nameerror");
const msgerror = document.getElementById("msgerror");
const phoneerr = document.getElementById("phoneerror");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  emailerror.textContent = "";
  nameerror.textContent = "";
  msgerror.textContent = "";
  phoneerr.textContent = "";

  const email = form.email.value;
  const phone = form.phone.value;
  const name = form.name.value;
  const message = form.message.value;

  document.getElementById("name").style.border = "2px solid rgb(209 213 219)";
  document.getElementById("email").style.border = "2px solid rgb(209 213 219)";
  document.getElementById("message").style.border = "2px solid rgb(209 213 219)";
  document.getElementById("phone").style.border = "2px solid rgb(209 213 219)";
  document.getElementById("message").style.border = "2px solid rgb(209 213 219)";

  try {
    const res = await fetch("/contact", {
      method: "POST",
      body: JSON.stringify({ email, name, message, phone }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.msg) {
      location.assign("/");
    }
    if (data.errors.name) {
      document.getElementById("name").style.border = "2px solid red";
    }
    if (data.errors.email) {
      document.getElementById("email").style.border = "2px solid red";
    }
    if (data.errors.password) {
      document.getElementById("message").style.border = "2px solid red";
    }
    if (data.errors.phone) {
      document.getElementById("phone").style.border = "2px solid red";
    }
    if (data.errors.message) {
      document.getElementById("message").style.border = "2px solid red";
    }
    nameerror.textContent = data.errors.name;
    emailerror.textContent = data.errors.email;
    msgerror.textContent = data.errors.message;
    phoneerr.textContent = data.errors.phone;
  } catch (err) {
    console.log(err);
  }
});
