const Usuario = require('../models/usuariosModels');
const { validateUsuario, validatePartialUsuario} = require('../schemas/validation')
const { obtenerFechaFormateada } = require('../utils/dateFormatter');

class UsuariosController {

    //Mostrar todas los usuarios
    async get(req, res, next) {
        console.log('Controller: Get All usuarios');
        try {
            const usuarios = await Usuario.get();
            const usuariosConEmail = usuarios.map(usuario => {
                return {
                    ...usuario,
                    email: `${usuario.email}@gmail.com`
                };
            });
            res.render('usuarios/index', { usuarios: usuariosConEmail });
        } catch (error) {
            console.error('Error al obtener usuarios desde el controlador:', error);
            next(error);
        }
    }

/*
    //Muestra la vista vista crear
    create(req, res) {
        res.render('personas/crear')
    }
    //Crear
    async store(req, res) {
        console.log('Controller: Store persona');
        try {
            // Convertir dni a número y nacimiento a Date
            const { dni, nombre, apellido, nacimiento: fechaNacimiento } = req.body;
            const { nombreStore } = req.query
            const dniNumero = Number(dni);
            const nacimientoDate = new Date(fechaNacimiento);

            // Validar datos
            const result = validatePersona({ dni: dniNumero, nombre, apellido, nacimiento: nacimientoDate });
            console.log('Datos Validados...');
            if (result.error) {
                console.log('Error al validar datos');
                return res.status(422).json({ error: result.error.issues });
            }

            // Convertir la fecha de nacimiento al formato YYYY-MM-DD
            const nacimiento = nacimientoDate.toISOString().split('T')[0];

            // Crear persona
            const personaCreada = await Persona.create({ dni: dniNumero, nombre, apellido, nacimiento });

            if (personaCreada) {
                console.log('Controller: Persona insertada con éxito');
                res.redirect(`/personas?nombreStore=${nombreStore}`);
            } else {
                //ver como mostrar el error en lado del client
                res.status(404).json({ message: 'Ya existe una persona con ese dni' });
            }
        } catch (error) {
            console.error('Error al Crear persona desde el controlador:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async edit(req, res) {
        const { dni } = req.params;
        console.log(`Controller: edit, Buscando persona con DNI: ${dni}`);
        try {
            const persona = await Persona.getPersonaByDni(dni);
            if (!persona) {
                console.log('Persona no encontrada');
                return res.status(404).send('Persona no encontrada');
            }
            console.log('Controller: Persona encontrada:', persona);
            console.log('Enviando a persona a la vista editar...')
            res.render('personas/editar', { persona });
        } catch (error) {
            console.error('Error al obtener persona para editar:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
    // editar
    async update(req, res, next) {
        console.log('Controller: Update Persona');
        try {
            const { dni, nombre, apellido, nacimiento: fechaNacimiento} = req.body;
            const { nombreUpdate } = req.query
            const dniNumero = Number(dni);
            const nacimientoDate = new Date(fechaNacimiento);

            const result = validatePartialPersona({ dni: dniNumero, nombre, apellido, nacimiento: nacimientoDate });
            console.log('Datos Validados...');
            if (!result.success) {
                console.log('Error al validar datos');
                return res.status(400).json({ error: JSON.parse(result.error.message) });
            }

            const nacimiento = nacimientoDate.toISOString().split('T')[0];
            const updatedPersona = await Persona.update({ dni: dniNumero, nombre, apellido, nacimiento });

            if (updatedPersona) {
                console.log('Controller: Persona modificada...');
                res.redirect(`/personas?nombreUpdate=${nombreUpdate}`);
            } else {
                res.status(404).json({ message: 'Persona no encontrada' });
            }
        } catch (error) {
            next(error);
        }
    }
    // Delete
    async delete(req, res, next) {
        console.log('Controller: Delete Persona');
        try {
            const { dni } = req.params;
            const { nombreDelete } = req.query; // Asegúrate de obtener nombreDelete de los parámetros de consulta
            const deletedPersona = await Persona.delete(dni);

            if (deletedPersona) {
                console.log('Controller: Persona eliminada...');
                res.redirect(`/personas?nombreDelete=${nombreDelete}`);
            } else {
                res.status(404).json({ message: 'Persona no encontrada' });
            }
        } catch (error) {
            next(error);
        }
    }
*/

}

module.exports = new UsuariosController()