document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('miFormulario');
  const resultado = document.getElementById('resultado');
  const datosEnviados = document.getElementById('datosEnviados');
  const progressFill = document.querySelector('.progress-fill');
  const textarea = formulario.querySelector('textarea');
  const contador = document.createElement('div');

  // Agregar contador de palabras
  contador.className = 'contador';
  textarea.insertAdjacentElement('afterend', contador);

  // 👉 Actualizar contador de palabras
  function actualizarContador() {
    const texto = textarea.value.trim();
    const palabras = texto === '' ? 0 : texto.split(/\s+/).length;
    contador.textContent = `Palabras: ${palabras}`;
  }

  // 👉 Calcular progreso del formulario
  function calcularProgreso() {
    const campos = Array.from(formulario.elements).filter(
      (el) =>
        el.tagName === 'INPUT' ||
        el.tagName === 'SELECT' ||
        el.tagName === 'TEXTAREA'
    );

    let llenos = 0;
    campos.forEach((campo) => {
      if (
        (campo.type !== 'checkbox' && campo.value.trim() !== '') ||
        (campo.type === 'checkbox' && campo.checked)
      ) {
        llenos++;
      }
    });

    const porcentaje = Math.floor((llenos / campos.length) * 100);
    progressFill.style.width = `${porcentaje}%`;
  }

  // 🎯 Manejo del envío
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const datosFormulario = new FormData(formulario);
    let datosHTML = '';

    for (let [campo, valor] of datosFormulario.entries()) {
      let nombreCampo = campo;
      switch (campo) {
        case 'nombre':
          nombreCampo = 'Nombre completo';
          break;
        case 'email':
          nombreCampo = 'Correo electrónico';
          break;
        case 'edad':
          nombreCampo = 'Edad';
          break;
        case 'ciudad':
          nombreCampo = 'Ciudad';
          break;
        case 'experiencia':
          nombreCampo = 'Experiencia en programación';
          break;
        case 'acepto':
          nombreCampo = 'Términos aceptados';
          valor = 'Sí ✅';
          break;
        case 'comentarios':
          nombreCampo = 'Comentarios';
          break;
      }

      if (valor && valor.trim() !== '') {
        datosHTML += `
          <div class="dato">
            <span class="etiqueta">${nombreCampo}:</span> ${valor}
          </div>`;
      }
    }

    datosEnviados.innerHTML = datosHTML;
    resultado.style.display = 'block';

    resultado.scrollIntoView({ behavior: 'smooth' });

    alert('✅ Formulario enviado correctamente.\nRevisa los datos más abajo.');
  });

  // 🧹 Botón limpiar
  function limpiarFormulario() {
    formulario.reset();
    resultado.style.display = 'none';
    datosEnviados.innerHTML = '';
    progressFill.style.width = '0%';
    contador.textContent = '';
  }

  // Crear botón limpiar
  const botonLimpiar = document.createElement('button');
  botonLimpiar.textContent = '🗑️ Limpiar Formulario';
  botonLimpiar.style.backgroundColor = '#ff9800';
  botonLimpiar.style.marginTop = '10px';
  botonLimpiar.style.width = '100%';
  botonLimpiar.onclick = limpiarFormulario;
  document.querySelector('.container').appendChild(botonLimpiar);

  // Eventos de interacción
  textarea.addEventListener('input', actualizarContador);
  formulario.addEventListener('input', calcularProgreso);
});
const botonEnviar = formulario.querySelector('button[type="submit"]');
botonEnviar.disabled = true; // 🔒 desactivado al inicio

function validarFormulario() {
  const campos = Array.from(formulario.elements).filter(
    (el) =>
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') &&
      el.type !== 'submit' &&
      el.name !== '' &&
      !el.disabled
  );

  let formularioValido = true;

  for (const campo of campos) {
    if (campo.type === 'checkbox' && !campo.checked) {
      formularioValido = false;
      break;
    } else if (
      campo.type !== 'checkbox' &&
      campo.value.trim() === ''
    ) {
      formularioValido = false;
      break;
    }
  }

  // Activar o desactivar botón
  botonEnviar.disabled = !formularioValido;
}

// Cada vez que se cambia un campo del formulario
formulario.addEventListener('input', validarFormulario);
formulario.addEventListener('change', validarFormulario);
