const toggleButton = document.querySelector(".navbar-toggle");
const navbarContent = document.querySelector(".navbar-content");

toggleButton.addEventListener("click", () => {
  navbarContent.classList.toggle("active");
});
