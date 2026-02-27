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

menuBar.addEventListener("click", ()=> {
  menuBar.style.display = "none";
  userNav.style.display = "flex";
  menuCross.style.display = "block";
});

menuCross.addEventListener("click", ()=>{
  menuCross.style.display = "none";
  userNav.style.display = "none";
  menuBar.style.display = "block";
});