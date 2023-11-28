// Obtener referencias a elementos HTML
const btnMostrar = document.getElementById('btnMostrar');
const ventana = document.getElementById('ventana');

// Mostrar la ventana emergente al hacer clic en el botón
btnMostrar.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic llegue al documento
    ventana.style.display = 'block';

    // Agregar un evento de escucha de clic al documento
    document.addEventListener('click', cerrarVentana);
});

// Función para cerrar la ventana emergente
function cerrarVentana() {
    ventana.style.display = 'none';

    // Quitar el evento de escucha de clic del documento
    document.removeEventListener('click', cerrarVentana);
}

// Función para cerrar la ventana emergente cuando se hace clic fuera de ella
ventana.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic llegue al documento
});

// Agregar un evento de escucha de clic al documento para cerrar la ventana al hacer clic fuera de ella
document.addEventListener('click', (e) => {
    if (ventana.style.display === 'block' && e.target !== btnMostrar) {
        cerrarVentana();
    }
});


// ------------------------------   Dar clase active segun la posicion url

// Obtiene la ruta de la página actual
const currentPath = window.location.pathname;

// Obtén todos los enlaces de navegación
const navLinks = document.querySelectorAll('.header__ruta');

// Recorre los enlaces y verifica si la ruta coincide con la página actual
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    // Agrega la clase "header-active" si la ruta coincide
    link.classList.add('header-active');
  } else {
    // Quita la clase "header-active" si no coincide
    link.classList.remove('header-active');
  }
});