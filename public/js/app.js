const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  nav.classList.toggle("flex");
  nav.classList.toggle("hidden");
});

const navele = document.getElementById("navbar");

// let currPos = window.scrollY;
// document.addEventListener("scroll", () => {
//   if (currPos < 70) {
//     navele.classList.remove("sticky");
//   } else {
//     //scroll up
//     navele.classList.add("sticky");
//   }
//   currPos = window.scrollY;
// });
