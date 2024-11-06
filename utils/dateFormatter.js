// Función para formatear fechas en el formato día-mes-año
const obtenerFechaFormateada = (fecha) => {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };
  
  module.exports = { obtenerFechaFormateada };
  