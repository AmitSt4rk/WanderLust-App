(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

let menuBar = document.querySelector(".navbar-bar");
let menuCross = document.querySelector(".navbar-cross");
let userNav = document.querySelector(".user-nav");

menuBar.addEventListener("click", () => {
    userNav.classList.add("active");
    menuBar.style.display = "none"
    menuCross.style.display = "block";
});

menuCross.addEventListener("click", () => {
    userNav.classList.remove("active");
    menuBar.style.display = "block"
    menuCross.style.display = "none";
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 732) {
        userNav.classList.remove("active");
        menuCross.style.display = "none";
    }
});