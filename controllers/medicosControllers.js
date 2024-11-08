const Medico = require('../models/medicosModels')// Modelo de médicos
const Persona = require('../models/personasModels')// Modelo de Personas
const Usuario = require('../models/usuariosModels')// Modelo de Usuarios
const Especialidad = require('../models/especialidadesModels') // Modelo de especialidades

const { validateMedicos, validatePartialMedicos } = require('../schemas/validation')
const { obtenerFechaFormateada } = require('../utils/dateFormatter');

class MedicosController {
    //Mostrar todas los medicos
    async get(req, res, next) {
        console.log('Controller: Get All medicos');
        try {
            const medicos = await Medico.getAll();
            const medicosConFechaFormateada = medicos.map(medico => {
                const fechaFormateada = obtenerFechaFormateada(new Date(medico.nacimiento));
                return { ...medico, nacimiento: fechaFormateada };
            });

            //console.log(medicosConFechaFormateada); // Verificar los datos aquí

            const { nombreUpdate, nombreStore, nombreInactivo, nombreActivo } = req.query;

            let mensaje = null;
            if (nombreInactivo) {
                mensaje = 'Se ha dado de Baja a un Medico';
            } else if (nombreActivo) {
                mensaje = 'Medico ha dado de Alta a un Medico';
            } else if (nombreUpdate) {
                mensaje = 'Medico Actualizado correctamente';
            } else if (nombreStore) {
                mensaje = 'Medico Creado correctamente';
            }

            res.render('medicos/index', { medicos: medicosConFechaFormateada, mensaje });
        } catch (error) {
            console.error('Error al obtener medicos desde el controlador:', error);
            next(error);
        }
    }
     //Mostrar especialidades
     async getCreateForm(req, res, next) {
        console.log('Controller: Especialidad get');
        try {
            const especialidades = await Especialidad.getAll();
            if (especialidades) {
                console.log('Especialidades enviadas al formulario');
                res.render('medicos/crear', { especialidades });
            } else {
                res.status(404).json({ message: 'Error al cargar las especialidades al formulario crear' });
            }
        } catch (error) {
            console.error('Error al obtener especialidades:', error);
            next(error);
        }
    }
    //Muestra la vista vista crear
    create(req, res) {
        res.render('medicos/crear')
    }
    //Inserta en la tabla Medico
    async store(req, res, next) {
        console.log('Controller: Create medico');
        try {
            // Extraer datos del formulario
            const { dni, nombre, apellido, nacimiento: fechaNacimiento, email, password, repeatPassword, id_rol, estado, especialidades, telefonos, matricula } = req.body;
            const { nombreStore } = req.query;

            // Validar datos
            const dateNacimiento = new Date(fechaNacimiento)
            const result = validateMedicos({ dni, nombre, apellido, fechaNacimiento: dateNacimiento, email, password, repeatPassword, id_rol, estado, especialidades, telefonos, matricula });
            if (!result.success) {
                console.log('Error al validar datos');
                return res.status(422).json({ error: result.error.issues });
            } else { console.log('Datos Validados...'); }
            //le paso datos validados y parseados
            const { dni: dniNumero, fechaNacimiento: nacimientoDate, id_rol: rolId, estado: estadoId, especialidades: especialidadId, telefonos: telefonoNumero, matricula: matriculaNumero } = result.data;
            // Validar que las contraseñas coincidan
            if (password !== repeatPassword) {
                return res.status(400).json({ error: 'Las contraseñas no coinciden' });
            }
            // Eliminar el dominio del email
            const emailSinDominio = email.split('@')[0];
            // Convertir la fecha de nacimiento al formato YYYY-MM-DD
            const nacimientoFinal = nacimientoDate.toISOString().split('T')[0];


            // Verificar si el DNI ya existe en la tabla personas
            const existingPersona = await Persona.getById({ dni: dniNumero });
            if (existingPersona) {
                return res.status(409).json({ message: 'Ya existe una persona con ese dni' });
            }
            // Crear Persona
            const personaCreada = await Persona.create({
                //datos ya validados.
                dni: dniNumero,
                nombre,
                apellido,
                nacimiento: nacimientoFinal,
            });

            if (!personaCreada) {
                return res.status(500).json({ message: 'Error al crear la persona' });
            }

            // Crear Usuario
            console.log('Controller: Crear usuario')
            const usuarioCreado = await Usuario.create({
                dni: dniNumero, // Usar el dni heredado de Persona
                email: emailSinDominio,
                password,
                id_rol: rolId
            });
            console.log('Controller: insertado usuario', usuarioCreado)
            //if (!usuarioCreado) {
            //  return res.status(500).json({ message: 'Error al crear el usuario' });
            //}

            //traigo el id del usuario creado
            const { id } = usuarioCreado;

            // Crear Medico
            const medicoCreado = await Medico.create({
                id_usuario: id,
                estado: estadoId,
                especialidades: especialidadId,
                telefonos: telefonoNumero,
                matricula: matriculaNumero
            });

            if (medicoCreado) {
                console.log('Controller: Medico insertada con éxito');
                res.redirect(`/medicos?nombreStore=${nombreStore}`);
            } else {
                res.status(404).json({ message: 'Error al crear el medico' });
            }
        } catch (error) {
            console.error('Error al crear medico desde el controlador:', error);
            next(error);
        }
    }
    //editar (vista)
    async edit(req, res, next) {
        try {
            const { dni } = req.params;

            console.log(`Controller: edit, Buscando medico por DNI: ${dni}`);

            // Obtengo las especialidades del medico
            const medicoData = await Medico.getEspecialidadesById(dni);
            if (!medicoData || medicoData.length === 0) {
                console.log('Controller Medico: Especialidad no encontrada');
                return res.status(404).json({ message: 'Medico no encontrado' });
            }
            console.log('Controller Medicos: Especialidad encontrada:', medicoData);

            // Dividir las especialidades y matrículas en arrays
            const especialidades = medicoData[0].especialidades.split(', ');
            const matriculas = medicoData[0].matriculas.split(', ');

            // Obtengo los datos Persona
            const persona = await Persona.getByDni(dni);
            if (!persona) {
                console.log('Controller Medico: Persona no encontrada');
                return res.status(404).send('Persona no encontrada');
            }
            console.log('Controller Medico: Persona encontrada:', persona);

            // Obtengo los datos de usuario y telefonos
            const { usuario, telefonos } = await Usuario.getByDni(dni);
            if (!usuario) {
                console.log('Controller Medico: Usuario no encontrado');
                return res.status(404).send('Usuario no encontrado');
            }
            console.log('Controller Medico: USUARIO encontrado:', usuario);
            console.log('Controller Medico: Teléfonos encontrados:', telefonos);

            // Obtengo los datos del Medico
            const medico = await Medico.getMedicoById(usuario.id);
            if (!medico) {
                console.log('Controller Medico: Medico no encontrado');
                return res.status(404).send('Medico no encontrado');
            }
            console.log('Controller Medico: Medico encontrado:', medico);

            console.log('Enviando a la vista editar...');

            res.render('medicos/editar', { persona, usuario, idEspecialidad: medicoData[0].idEspecialidad, especialidades, matriculas, medico, telefonos });
        } catch (error) {
            console.error('Error los datos', error);
            next(error);
        }
    }
    // editar
    async update(req, res, next) {
        console.log('Controller: Update Medico');
        try {
            const { id, dni } = req.params;
            const { nombre, apellido, nacimiento: fechaNacimiento, email, password, telefonosAlternativo } = req.body;
            const nombreUpdate = nombre;
            // Validar datos
            const dateNacimiento = new Date(fechaNacimiento);
            const result = validatePartialMedicos({ nombre, apellido, fechaNacimiento: dateNacimiento, email, password, telefonosAlternativo });
            if (!result.success) {
                console.log('Error al validar datos');
                return res.status(400).json({ error: JSON.parse(result.error.message) });
            } else {
                console.log('Datos Validados...');
            }
    
            // Extraer datos validados y parseados
            const { fechaNacimiento: nacimientoDate, telefonos: telefonoAlternativo } = result.data;
    
            // Eliminar el dominio del email
            const emailSinDominio = email.split('@')[0];
    
            // Convertir la fecha de nacimiento al formato YYYY-MM-DD
            const nacimientoFinal = nacimientoDate.toISOString().split('T')[0];
    
            // Actualizar persona
            console.log('Controller Medico: Update persona');
            const updateP = { nombre, apellido, nacimiento: nacimientoFinal };
            const updatedPersona = await Persona.updatePersona(dni, updateP);
            if (!updatedPersona) {
                return res.status(404).json({ message: 'Error al modificar la persona desde MedicoController' });
            }
    
            // Actualizar usuario
            console.log('Controller Medico: Update usuario');
            const updateU = { email: emailSinDominio, password };
            const updatedUsuario = await Usuario.updateUsuario(dni, updateU);
            console.log('Resultado de updateUsuario:', updatedUsuario);
            if (!updatedUsuario) {
                return res.status(404).json({ message: 'Error al modificar el usuario desde MedicoController' });
            }
    
            // Guardar el teléfono alternativo si se proporciona
            if (telefonoAlternativo) {
                await Usuario.addTelefonoAlternativo(id, telefonoAlternativo);
                console.log('Teléfono alternativo guardado:', telefonoAlternativo);
            } else {console.log('No hay Teléfono alternativo')}
    
            // Verificar y redirigir
            console.log('Nombre Update:', nombreUpdate);
            if (!nombreUpdate) {
                return res.redirect('/medicos');
            }
            res.redirect(`/medicos?nombreUpdate=${nombreUpdate}`);
        } catch (error) {
            next(error);
        }
    }
    // Delete logico (activar/inactivar), si pide un delete, se debe borrar atravez de las tablas de forma permanente
    // Inactivate
    async inactivar(req, res, next) {
        console.log('Controller: Inactivar Medico');
        try {
            let flag = false
            const { dni } = req.params; // Asegúrate de que req.params.dni esté definido correctamente
            
            //buscar id de usuario atravez del dni
            const idUser = await Usuario.getByDni(dni)
            if(!idUser) {
                return res.status(404).json({ message: 'Error al bucar id usuario a inactivar en MedicoController' });
            }
            const { id } = idUser.usuario

            //Inactivar el médico
            const result = await Medico.inactivarMedico(id);
            if (!result) {
                return res.status(404).json({ message: 'Error al inactivar el médico desde MedicoController' });
            }
            flag = true
            res.redirect(`/medicos?nombreInactivo=${flag}`);
        } catch (error) {
            next(error);
        }
    }
    // Activate
    async activar(req, res, next) {
        console.log('Controller: activar Medico');
        try {
            let flag = false
            const { dni } = req.params; // Asegúrate de que req.params.dni esté definido correctamente
            console.log('dni', dni);
    
            
            //buscar id de usuario atravez del dni
            const idUser = await Usuario.getByDni(dni)
            if(!idUser) {
                return res.status(404).json({ message: 'Error al bucar id usuario a inactivar en MedicoController' });
            }
            const { id } = idUser.usuario
            
            //Activar el médico
            const result = await Medico.activarMedico(id);
            if (!result) {
                return res.status(404).json({ message: 'Error al activar el médico desde MedicoController' });
            }
            flag = true
            res.redirect(`/medicos?nombreActivo=${flag}`);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MedicosController()