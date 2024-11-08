
const express = require('express');
const PacientesRouter = express.Router()
const PacientesControllers = require('../controllers/pacientesControllers');

// Index
PacientesRouter.get('/', PacientesControllers.get)
// Vista crear (GET para mostrar el formulario)
PacientesRouter.get('/create', PacientesControllers.getCreateForm)

// redirigir a la vista crear
PacientesRouter.get('/create', PacientesControllers.create)

// Guardar nuevo médico (POST para la ruta raíz, si es necesario)
PacientesRouter.post('/', PacientesControllers.store)

// Vista editar
PacientesRouter.get('/edit/:dni', PacientesControllers.edit)
/
// Actualizar médico
PacientesRouter.post('/update/:dni', PacientesControllers.update);

// Eliminar médico
PacientesRouter.post('/activar/:dni', PacientesControllers.activar)
//inactivar
PacientesRouter.post('/inactivar/:dni', PacientesControllers.inactivar)

module.exports = PacientesRouter