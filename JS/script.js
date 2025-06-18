document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('miFormulario');
  const resultado = document.getElementById('resultado');
  const datosEnviados = document.getElementById('datosEnviados');
  const progressFill = document.querySelector('.progress-fill');
  const textarea = formulario.querySelector('textarea');
  const contador = document.createElement('div');
  const botonEnviar = formulario.querySelector('button[type="submit"]');

  // 👉 Configurar contador de palabras
  contador.className = 'contador';
  textarea.insertAdjacentElement('afterend', contador);

  function actualizarContador() {
    const texto = textarea.value.trim();
    const palabras = texto === '' ? 0 : texto.split(/\s+/).length;
    contador.textContent = `Palabras: ${palabras}`;
  }

  function calcularProgreso() {
    const campos = Array.from(formulario.elements).filter(
      (el) =>
        (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') &&
        el.type !== 'submit' && el.name !== ''
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

    // Activar o desactivar el botón según el progreso
    botonEnviar.disabled = porcentaje < 100;
  }

  // 📝 Validar formulario
  function validarFormulario() {
    const campos = Array.from(formulario.elements).filter(
      (el) =>
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') &&
        el.type !== 'submit' && el.name !== '' && !el.disabled
    );

    let formularioValido = campos.every((campo) => {
      if (campo.type === 'checkbox') return campo.checked;
      return campo.value.trim() !== '';
    });

    botonEnviar.disabled = !formularioValido;
  }

  // 🎯 Manejar envío
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const datosFormulario = new FormData(formulario);
    let datosHTML = '';

    for (let [campo, valor] of datosFormulario.entries()) {
      let nombreCampo = campo;
      switch (campo) {
        case 'nombre': nombreCampo = 'Nombre completo'; break;
        case 'email': nombreCampo = 'Correo electrónico'; break;
        case 'edad': nombreCampo = 'Edad'; break;
        case 'ciudad': nombreCampo = 'Ciudad'; break;
        case 'experiencia': nombreCampo = 'Experiencia en programación'; break;
        case 'acepto': nombreCampo = 'Términos aceptados'; valor = 'Sí ✅'; break;
        case 'comentarios': nombreCampo = 'Comentarios'; break;
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

  // 🧹 Limpiar formulario
  function limpiarFormulario() {
    formulario.reset();
    resultado.style.display = 'none';
    datosEnviados.innerHTML = '';
    progressFill.style.width = '0%';
    contador.textContent = '';
    botonEnviar.disabled = true;
  }

  // Crear botón limpiar
  const botonLimpiar = document.createElement('button');
  botonLimpiar.textContent = '🗑️ Limpiar Formulario';
  botonLimpiar.style.backgroundColor = '#ff9800';
  botonLimpiar.style.marginTop = '10px';
  botonLimpiar.style.width = '100%';
  botonLimpiar.onclick = limpiarFormulario;
  document.querySelector('.container').appendChild(botonLimpiar);

  // 🔁 Eventos para activar validaciones y contador
  textarea.addEventListener('input', () => {
    actualizarContador();
    calcularProgreso();
    validarFormulario();
  });

  formulario.addEventListener('input', () => {
    calcularProgreso();
    validarFormulario();
  });

  formulario.addEventListener('change', () => {
    calcularProgreso();
    validarFormulario();
  });

  // Inicialización segura
  botonEnviar.disabled = true;
});
