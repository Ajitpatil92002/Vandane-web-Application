
const popupOverlay = document.querySelector(".popup-overlay");
const popupClose = document.querySelector(".popup-close");
const popupCancel = document.querySelector(".popup-cancel");
const openmodels = document.querySelectorAll(".openmodel");

openmodels.forEach((openmodel) => {
  openmodel.addEventListener("click", () => {
    popupOverlay.classList.replace("hidden","flex");
  });
});

popupClose.addEventListener("click", () => {
  popupOverlay.classList.replace("flex","hidden");
});

popupCancel.addEventListener("click", () => {
  popupOverlay.classList.replace("flex","hidden");
});
