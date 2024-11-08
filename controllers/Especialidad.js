const Especialidad = require('../models/especialidadesModels');

class EspecialidadController {
    async getAll(req, res) {
        try {
            const especialidades = await Especialidad.getAll();
            res.status(200).json(especialidades);
        } catch (error) {
            console.error('Error fetching especialidades:', error);
            res.status(500).json({ message: 'Error al traer especialidades' });
        }
    }
}
module.exports = new EspecialidadController()

