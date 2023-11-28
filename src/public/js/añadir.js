document.addEventListener("DOMContentLoaded", function () {
  const restarBtn = document.querySelector(".restar");
  const sumarBtn = document.querySelector(".sumar");
  const cantidadInput = document.querySelector(".cantidad-producto");
  const añadirEnlace = document.querySelector(".añadir-producto");


  // Event listeners para controlar la cantidad
  restarBtn.addEventListener("click", function () {
    if (cantidadInput.value > 0) {
      cantidadInput.value = parseInt(cantidadInput.value) - 1;
    }
  });

  sumarBtn.addEventListener("click", function () {
    cantidadInput.value = parseInt(cantidadInput.value) + 1;
  });

  // Event listener para añadir producto al carrito
  añadirEnlace.addEventListener("click", function (event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll( '.añadir__adicionesles-opciones input[type="checkbox"]');
    const adicionales = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const productId = event.currentTarget.id;
    const cantidad = cantidadInput.value;

    fetch(`/agregar-producto/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, cantidad, adicionales }),
    })
      .then((response) => response.json())
      .then((data) => {
        // manejo de respuesta
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST", error);
      });

    const returnTo = "/productos/hamburguesas";
    window.location.href = returnTo;
  });
});

// <!-- <a href="/agregar-producto/<%= producto._id %>">Añadir</a> -->