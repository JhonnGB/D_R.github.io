const formulario = document.querySelector('form');
const formaEntrega = document.getElementById("formaEntrega");
const direccionEnvioLabel = document.getElementById("direccionEnvioLabel");
const infoAdicionalLabel = document.getElementById("infoAdicionalLabel");
const direccionEnvio = document.getElementById("direccionEnvio");
const infoAdicional = document.getElementById("infoAdicional");

formulario.addEventListener('submit', function(event) {
    if (formaEntrega.value === 'recoger al local') {
        direccionEnvioLabel.style.display = 'none';
        infoAdicionalLabel.style.display = 'none';
        direccionEnvio.disabled = true;
        infoAdicional.disabled = true;
    } else {
        if (direccionEnvioLabel.style.display === 'block') {
            if (!direccionEnvio.value) {
                event.preventDefault();
                return;
            }
        }
    }
});

formaEntrega.addEventListener("change", function () {
    if (formaEntrega.value === "domicilio") {
        direccionEnvioLabel.style.display = "block";
        infoAdicionalLabel.style.display = "block";
        direccionEnvio.disabled = false;
        infoAdicional.disabled = false;
    } else {
        direccionEnvioLabel.style.display = "none";
        infoAdicionalLabel.style.display = "none";
        direccionEnvio.disabled = true;
        infoAdicional.disabled = true;
    }
});