const express = require('express');
const router = express.Router();
const EspecialidadController = require('../controllers/Especialidad');

router.get('/especialidades', EspecialidadController.getAll);


module.exports = EspecialidadController;
//module.exports = especialidadRoutes;
