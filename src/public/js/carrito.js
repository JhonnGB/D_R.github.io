// Función para mostrar la ventana emergente
function mostrarVentana(index) {
    // Mostrar el fondo difuminado
    document.querySelector('.fondo-difuminado').style.display = 'block';
    // Mostrar la ventana emergente
    document.querySelectorAll('.detalles-pedido__ventana')[index].style.display = 'block';
}

// Función para cerrar todas las ventanas emergentes y ocultar el fondo difuminado
function cerrarVentanas() {
    document.querySelectorAll('.detalles-pedido__ventana').forEach(function(ventana) {
        ventana.style.display = 'none';
    });
    // Ocultar el fondo difuminado
    document.querySelector('.fondo-difuminado').style.display = 'none';
}


// Asociar la función mostrarVentana al clic del botón
document.querySelectorAll('.mostrarDetallesPedido').forEach(function(button) {
    button.addEventListener('click', function(event) {
        // Detener la propagación del evento para evitar que se cierre inmediatamente
        event.stopPropagation();
        // Obtener el índice del botón clickeado
        var index = button.getAttribute('data-index');
        // Mostrar la ventana correspondiente
        mostrarVentana(index);
    });
});

// Realizar evento cerrarVentanas al hacer clic fuera de ellas
document.addEventListener('click', function(event) {
    // Verificar si el clic ocurrió fuera de las ventanas emergentes y no dentro de los botones
    if (!event.target.closest('.detalles-pedido__ventana') && !event.target.classList.contains('mostrarDetallesPedido')) {
        cerrarVentanas();
    }
});