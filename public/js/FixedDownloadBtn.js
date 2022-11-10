const mybutton = document.querySelector(".download");
window.onscroll = function () {
  scrollFunction();
  if (window.innerHeight + window.scrollY > document.body.clientHeight) {
    mybutton.style.display = "none";
  }
};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    mybutton.style.display = "block";
  } else if (window.innerHeight + window.scrollY > document.body.clientHeight) {
    mybutton.style.display = "none";
  } else {
    mybutton.style.display = "none";
  }
}
