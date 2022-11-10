let form = document.querySelector("form");
let msg = document.querySelector(".msg");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${location.href}`, {
      method: "POST",
      body: JSON.stringify({
        password: form.password.value,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    if(data.msg === "Password is Reseted"){
      location.assign("/auth/login");
    }
    msg.textContent = data.msg;
  } catch (err) {
    console.log(err);
  }
});