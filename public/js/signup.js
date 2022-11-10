const form = document.querySelector("form");
const emailerror = document.getElementById("emailerror");
const nameerror = document.getElementById("nameerror");
const passworderr = document.getElementById("passworderr");
const phoneerr = document.getElementById("phoneerror");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  emailerror.textContent = "";
  nameerror.textContent = "";
  passworderr.textContent = "";
  phoneerr.textContent = "";

  const email = form.email.value;
  const password = form.password.value;
  const username = form.username.value;
  const phone = form.phone.value;
  try {
    const res = await fetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username, phone }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.msg) {
      location.assign(data.msg);
    }
    if (data.errors.username) {
      document.getElementById("username").style.border = "2px solid red";
    }
    if (data.errors) {
      console.log(data);
    }
    if (data.errors.email) {
      document.getElementById("email").style.border = "2px solid red";
    }
    if (data.errors.password) {
      document.getElementById("password").style.border = "2px solid red";
    }
    if (data.errors.phone) {
      document.getElementById("phone").style.border = "2px solid red";
    }

    nameerror.textContent = data.errors.username;
    emailerror.textContent = data.errors.email;
    passworderr.textContent = data.errors.password;
    phoneerr.textContent = data.errors.phone;
  } catch (err) {
    console.log(err);
  }
});