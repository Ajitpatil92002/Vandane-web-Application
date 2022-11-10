let form = document.querySelector("form");
let msg = document.querySelector(".msg");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/auth/forgetpassword", {
      method: "POST",
      body: JSON.stringify({ email: form.email.value }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    msg.textContent = data.msg;
    if (data.msg) {
      setInterval(() => {
        location.assign("/auth/login");
      }, 2000);
    }
  } catch (err) {
    console.log(err);
  }
});