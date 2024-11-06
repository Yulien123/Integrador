document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const dni = document.getElementById('dni');
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const nacimiento = document.getElementById('nacimiento');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const repeatPassword = document.getElementById('repeatPassword');
  const idRol = document.getElementById('id_rol');
  const estado = document.getElementById('estado');
  const especialidades = document.getElementById('especialidades');
  const telefonos = document.getElementById('telefonos');

  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (event) => {
    let valid = true;

    // Verificar campos de texto
    [dni, nombre, apellido, estado, telefonos].forEach(input => {
      if (specialCharPattern.test(input.value)) {
        valid = false;
        alert(`El campo ${input.name} no debe contener caracteres especiales.`);
      }
    });

    // Verificar email
    if (!emailPattern.test(email.value)) {
      valid = false;
      alert('Por favor, ingrese un email válido.');
    }

    // Verificar fecha de nacimiento
    if (new Date(nacimiento.value) > new Date()) {
      valid = false;
      alert('La fecha de nacimiento no puede ser en el futuro.');
    }

    // Verificar contraseña (mínimo 8 caracteres)
    if (password.value.length < 8) {
      valid = false;
      alert('La contraseña debe tener al menos 8 caracteres.');
    }

    // Verificar que las contraseñas coincidan
    if (password.value !== repeatPassword.value) {
      valid = false;
      alert('Las contraseñas no coinciden.');
    }

    // Verificar rol (debe ser un número positivo)
    if (isNaN(idRol.value) || idRol.value <= 0) {
      valid = false;
      alert('El rol debe ser un número positivo.');
    }

    if (!valid) {
      event.preventDefault();
    }
  });
});

