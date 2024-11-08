const express = require('express');
const router = express.Router();
const EspecialidadController = require('../controllers/Especialidad');

const especialidadRoutes = router.get('/', EspecialidadController.getAll);


//module.exports = EspecialidadController;
module.exports = especialidadRoutes;
