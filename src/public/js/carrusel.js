// const grande = document.querySelector('.grande');
// const punto = document.querySelectorAll('.carrusel__btn');

// punto.forEach( ( cadaPunto, i )=> {
//   punto[i].addEventListener('click', ()=> {
//     let posicion = i
//     let operacion = posicion * -33.33
//     // console.log( posicion, operacion)
//     grande.style.transform = `translateX(${operacion}%)`;

//     punto.forEach( (cadaPunto, i )=> {
//       // se quita la clase activo 
//       punto[i].classList.remove('btn-activo')
//     })
//     // se añade la clase activo
//     punto[i].classList.add('btn-activo')
//   })
// })

const carruselDiv = document.querySelector('.carrusel-inicio__div');
const punto = document.querySelectorAll('.carrusel__btn');
const flechaIzquierda = document.querySelector('.carrusel-flecha-izquierda');
const flechaDerecha = document.querySelector('.carrusel-flecha-derecha');
let currentIndex = 0; // Para rastrear la posición actual del carrusel
const intervalTime = 5000; // Tiempo en milisegundos entre cambios automáticos
let interval;

// Función para cambiar al siguiente elemento en el carrusel
function nextSlide() {
  currentIndex = (currentIndex + 1) % punto.length;
  moveSlide();
}

// Función para mover el carrusel a la posición actual
function moveSlide() {
  let operacion = currentIndex * -33.33;
  carruselDiv.style.transform = `translateX(${operacion}%)`;

  // Quitar la clase activo a todos los puntos
  punto.forEach((cadaPunto) => {
    cadaPunto.classList.remove('btn-activo');
  });

  // Añadir la clase activo al punto actual
  punto[currentIndex].classList.add('btn-activo');
}

// Agregar evento de clic a cada punto
punto.forEach((cadaPunto, i) => {
  cadaPunto.addEventListener('click', () => {
    currentIndex = i;
    moveSlide();
    resetInterval(); // Reiniciar el temporizador al hacer clic manualmente
  });
});

// Función para iniciar el temporizador
function startInterval() {
  interval = setInterval(nextSlide, intervalTime);
}

// Función para reiniciar el temporizador
function resetInterval() {
  clearInterval(interval);
  startInterval();
}

// Iniciar el temporizador cuando se carga la página
startInterval();

// Agregar eventos de clic a las flechas
flechaIzquierda.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + punto.length) % punto.length;
  moveSlide();
  resetInterval();
});

flechaDerecha.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % punto.length;
  moveSlide();
  resetInterval();
});