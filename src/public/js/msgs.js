const msgsSuccess = document.getElementById("msgsPop-up");

function mostrarDiv() {
  msgsSuccess.classList.remove("ocultar-div__msg");
}
function ocultarDiv() {
  msgsSuccess.classList.add("ocultar-div__msg");
  // Ocultar totalmente el div
  setTimeout(function() { msgsSuccess.style.display = "none" }, 4000);
}

// Agrega eventos 'mouseenter' y 'mouseleave' al div
msgsSuccess.addEventListener("mouseenter", mostrarDiv);
msgsSuccess.addEventListener("mouseleave", ocultarDiv);
document.addEventListener("DOMContentLoaded", ocultarDiv);


// quitar totalmente el div por un click
document.addEventListener("click", function () {
  msgsSuccess.style.display = "none"
});