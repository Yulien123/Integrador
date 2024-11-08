
const express = require('express');
const MedicosRouter = express.Router()
const MedicosControllers = require('../controllers/medicosControllers');

// Index
MedicosRouter.get('/', MedicosControllers.get);

// Vista crear (GET para mostrar el formulario)
MedicosRouter.get('/create', MedicosControllers.getCreateForm);

// redirigir a la vista crear
MedicosRouter.get('/create', MedicosControllers.create);

// Guardar nuevo médico (POST para la ruta raíz, si es necesario)
MedicosRouter.post('/', MedicosControllers.store);

// Vista editar
MedicosRouter.get('/edit/:dni', MedicosControllers.edit);

// Actualizar médico
MedicosRouter.post('/update/:dni', MedicosControllers.update);

// Eliminar médico
MedicosRouter.post('/activar/:dni', MedicosControllers.activar)
//inactivar
MedicosRouter.post('/inactivar/:dni', MedicosControllers.inactivar);


module.exports = MedicosRouter;
