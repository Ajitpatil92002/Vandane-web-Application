const form = document.querySelector("form");
const emailerror = document.getElementById("emailerror");
const passworderr = document.getElementById("passworderr");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("email").style.border = "2px solid white";
  document.getElementById("password").style.border = "2px solid white";

  emailerror.textContent = "";
  passworderr.textContent = "";

  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    console.log(data);
    if (data.user) {
      location.assign("/");
    }
    if (data.errors.email) {
      document.getElementById("email").style.border = "2px solid red";
    }
    if (data.errors.password) {
      document.getElementById("password").style.border = "2px solid red";
    }
    if (data.errors) {
      emailerror.textContent = data.errors.email;
      passworderr.textContent = data.errors.password;
    }
  } catch (err) {
    console.log(err);
  }
});