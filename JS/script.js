document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('miFormulario');
  const resultado = document.getElementById('resultado');
  const datosEnviados = document.getElementById('datosEnviados');
  const progressFill = document.getElementById('progressFill');
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

    botonEnviar.disabled = porcentaje < 100;
  }

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

  // 👉 Validaciones específicas de campos

  document.getElementById('nombre').addEventListener('input', function () {
    const valor = this.value.trim();
    const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);
    const mensaje = document.getElementById('mensajeNombre');

    if (valor.length < 3) {
      mensaje.textContent = 'El nombre debe tener al menos 3 caracteres';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else if (nombres.length < 2) {
      mensaje.textContent = 'Ingresa al menos 2 nombres';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else {
      mensaje.textContent = '✓ Nombre válido';
      mensaje.style.color = 'green';
      marcarCampo(this, true);
    }
  });

  document.getElementById('email').addEventListener('input', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mensaje = document.getElementById('mensajeCorreo');

    if (!emailRegex.test(this.value.trim())) {
      mensaje.textContent = 'Formato de email inválido';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else {
      mensaje.textContent = '✓ Email válido';
      mensaje.style.color = 'green';
      marcarCampo(this, true);
    }
  });

  document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const fortaleza = calcularFortalezaPassword(password);
    const mensaje = document.getElementById('mensajePassword');
    const fortalezaMensaje = document.getElementById('fortaleza');

    // Actualizar la barra de fortaleza (si tienes una función para esto)
    actualizarBarraFortaleza(fortaleza);

    // Validación de la contraseña
    if (password.length < 8) {
        mensaje.textContent = 'La contraseña debe tener al menos 8 caracteres';
        mensaje.style.color = 'red';
        marcarCampo(this, false);
    } else if (fortaleza.nivel < 2) {
        mensaje.textContent = 'Contraseña muy débil. Añade números y símbolos';
        mensaje.style.color = 'red';
        marcarCampo(this, false);
    } else {
        mensaje.textContent = '✓ Contraseña válida';
        mensaje.style.color = 'green';
        marcarCampo(this, true);
    }

    // Mostrar la fortaleza de la contraseña
    fortalezaMensaje.textContent = `Fortaleza: ${fortaleza.texto}`;
    fortalezaMensaje.style.color = fortaleza.nivel < 2 ? 'red' : 'green';

    // Validar el campo de confirmar contraseña si ya tiene valor
    const confirmar = document.getElementById('confirmarPassword');
    if (confirmar.value) {
        confirmar.dispatchEvent(new Event('input'));
    }
});

// Función para calcular la fortaleza de la contraseña
function calcularFortalezaPassword(password) {
    let nivel = 0;
    let texto = '';

    if (password.length >= 8) {
        nivel++;
    }
    if (/[A-Z]/.test(password)) {
        nivel++;
    }
    if (/[a-z]/.test(password)) {
        nivel++;
    }
    if (/[0-9]/.test(password)) {
        nivel++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
        nivel++;
    }

    switch (nivel) {
        case 0:
            texto = 'Muy débil';
            break;
        case 1:
            texto = 'Débil';
            break;
        case 2:
            texto = 'Moderada';
            break;
        case 3:
            texto = 'Fuerte';
            break;
        case 4:
            texto = 'Muy fuerte';
            break;
    }

    return { nivel, texto };
}
function actualizarBarraFortaleza(fortaleza) {
    
}

  document.getElementById('confirmarPassword').addEventListener('input', function () {
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensajeConfrimPass');

    if (this.value !== password) {
      mensaje.textContent = 'Las contraseñas no coinciden';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else if (this.value.length > 0) {
      mensaje.textContent = '✓ Contraseñas coinciden';
      mensaje.style.color = 'green';
      marcarCampo(this, true);
    }
  });

  document.getElementById('telefono').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '');
    const mensaje = document.getElementById('mensajeTelefono');

    if (valor.length >= 6) {
      valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
    } else if (valor.length >= 3) {
      valor = valor.substring(0, 3) + '-' + valor.substring(3);
    }

    this.value = valor;

    const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    if (!telefonoRegex.test(valor)) {
      mensaje.textContent = 'Formato: 300-123-4567';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else {
      mensaje.textContent = '✓ Teléfono válido';
      mensaje.style.color = 'green';
      marcarCampo(this, true);
    }
  });

  document.getElementById('fechaNacimiento').addEventListener('change', function () {
    const fechaNacimiento = new Date(this.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const mensaje = document.getElementById('mensajeFecha');

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      mensaje.textContent = 'Debes ser mayor de 18 años';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else if (edad > 100) {
      mensaje.textContent = 'Fecha no válida';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else {
      mensaje.textContent = `✓ Edad: ${edad} años`;
      mensaje.style.color = 'green';
      marcarCampo(this, true);
    }
  });

  document.getElementById('comentarios').addEventListener('input', function () {
    const contadorComentarios = document.getElementById('contadorComentarios');
    contadorComentarios.textContent = this.value.length;

    if (this.value.length > 450) {
      contadorComentarios.style.color = '#dc3545';
    } else if (this.value.length > 400) {
      contadorComentarios.style.color = '#ffc107';
    } else {
      contadorComentarios.style.color = '#666';
    }

    marcarCampo(this, true);
  });

  document.getElementById('acepto').addEventListener('change', function () {
    const mensaje = document.getElementById('mensajeTerminos');
    if (!this.checked) {
      mensaje.textContent = 'Debes aceptar los términos y condiciones';
      mensaje.style.color = 'red';
      marcarCampo(this, false);
    } else {
      mensaje.textContent = '';
      marcarCampo(this, true);
    }
  });


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
        case 'password':
          nombreCampo = 'Contraseña';
          break;
        case 'confirmarPassword':
          nombreCampo = 'Confirmación de contraseña';
          break;
        case 'telefono':
          nombreCampo = 'Teléfono';
          break;
        case 'fechaNacimiento':
          nombreCampo = 'Fecha de nacimiento';
          break;
        case 'comentarios':
          nombreCampo = 'Comentarios';
          break;
        case 'web':
          nombreCampo = 'Página web';
          break;
        case 'acepto':
          nombreCampo = 'Términos aceptados';
          valor = 'Sí ✅';
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

  function limpiarFormulario() {
    formulario.reset();
    resultado.style.display = 'none';
    datosEnviados.innerHTML = '';
    progressFill.style.width = '0%';
    contador.textContent = '';
    botonEnviar.disabled = true;

    const contadorComentarios = document.getElementById('contadorComentarios');
    if (contadorComentarios) contadorComentarios.textContent = '';
  }

  const botonLimpiar = document.createElement('button');
  botonLimpiar.textContent = '🗑️ Limpiar Formulario';
  botonLimpiar.style.backgroundColor = '#ff9800';
  botonLimpiar.style.marginTop = '10px';
  botonLimpiar.style.width = '100%';
  botonLimpiar.onclick = limpiarFormulario;
  document.querySelector('.container').appendChild(botonLimpiar);

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

  botonEnviar.disabled = true;
  actualizarContador();
});
