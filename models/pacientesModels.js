const createConnection = require('../config/configDb');
const Usuario = require('./usuariosModels'); // clase padre

class Paciente extends Usuario {
    constructor(id, dni, nombre, apellido, nacimiento, email, password, id_rol, obra_sociales, telefonos,) {
        super(id, dni, nombre, apellido, nacimiento, email, password, id_rol);
        this.obra_sociales = obra_sociales
        this.telefonos = telefonos
    }
    //Mostrar todos
    static async getAll() {
        console.log('Model Paciente: Get All');
        let conn;
        try {
            conn = await createConnection();
            const [pacientes] = await conn.query(`
                SELECT pa.id_usuario, pa.dni, p.nombre, p.apellido, p.nacimiento, u.email, u.password, u.id_rol,
                GROUP_CONCAT(DISTINCT os.nombre SEPARATOR ', ') AS obra_sociales,
                GROUP_CONCAT(DISTINCT t.numero SEPARATOR ', ') AS telefonos, pa.estado
                FROM pacientes pa 
                JOIN usuarios u ON pa.id_usuario = u.id 
                JOIN personas p ON pa.dni = p.dni 
                LEFT JOIN obras_sociales os ON pa.id_obra_social = os.id 
                LEFT JOIN telefonos t ON u.id = t.id_usuario 
                GROUP BY pa.id_usuario;
            `);

            return pacientes.map(paciente => new Paciente(
                paciente.id_usuario,
                paciente.dni,
                paciente.nombre,
                paciente.apellido,
                paciente.nacimiento,
                paciente.email,
                paciente.password,
                paciente.id_rol,
                paciente.obra_sociales,
                paciente.telefonos,
                paciente.estado

            ));
        } catch (error) {
            console.error('Error fetching pacientes:', error);
            throw new Error('Error al traer pacientes desde el modelo');
        } finally {
            if (conn) conn.end();
        }
    }
    //insertar paciente
    static async create({ dni, id_usuario, estado, telefonos, obra_sociales }) {
        console.log('Model: Create Paciente');
        let conn;
        try {
            conn = await createConnection();
            await conn.beginTransaction();
            //buscar el id de la obra social para agregarsela
           
            const [obraSocial] = await conn.query(`
                SELECT id FROM obras_sociales WHERE nombre = ?;
                `, [obra_sociales])
            if (!obraSocial) {
                throw new Error('Error al intentar buscar el id de obra social');
            }
            const { id } = obraSocial[0]

            // Insertar en la tabla paciente
            const [resultPaciente] = await conn.query(`
                INSERT INTO pacientes (dni, id_usuario, id_obra_social, estado)
                VALUES (?, ?, ?, ?)
            `, [dni, id_usuario, id, estado]);

            if (resultPaciente.affectedRows === 0) {
                throw new Error('Error al insertar en la tabla paciente');
            }

            // Insertar en la tabla telefonos
            const [resultTelefonos] = await conn.query(`
                INSERT INTO telefonos (id_usuario, numero)
                VALUES (?, ?)
            `, [id_usuario, telefonos]);

            if (resultTelefonos.affectedRows === 0) {
                throw new Error('Error al insertar en la tabla telefonos');
            }

            await conn.commit();
            return id_usuario;
        } catch (error) {
            if (conn) await conn.rollback();
            console.error('Error creating paciente:', error);
            throw new Error('Error al crear paciente ');
        } finally {
            if (conn) conn.end();
        }
    }
    //mostrar todas las obras sociales
    static async getAllOS() {
        let conn;
        try {
            conn = await createConnection();
            const [obra_sociales] = await conn.query('SELECT id, nombre FROM obras_sociales');
            return obra_sociales;
        } catch (error) {
            console.error('Error fetching especialidades:', error);
            throw new Error('Error al traer especialidades desde el modelo');
        } finally {
            if (conn) conn.end();
        }
    }
    //Mostrar paciente por id
    static async getPacienteByDni(dni) {
        console.log(`Model: getByDni paciente dni: ${dni}`);
        try {
            const conn = await createConnection();
            console.log('Conexión a la base de datos establecida');

            const [paciente] = await conn.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
            if (!paciente || paciente.length === 0) {
                console.log('Model Pacientes: No se encontró ningún paciente');
                return null;
            }
            console.log('Model: Resultado de la consulta paciente:', paciente);
            return paciente[0]; // Devolver el primer objeto del array
        } catch (error) {
            console.error('Model Paciente: Error al obtener paciente por id:', error);
            throw error;
        }
    }
    // muestra obra sociales del paciente para mostrar en el form del paciente
    static async getObraSocialByDni(dni) {
        let conn;
        try {
            conn = await createConnection();
            const [obra_social] = await conn.query(`
                SELECT os.id, os.nombre FROM obras_sociales os 
                JOIN pacientes p ON os.id = p.id_obra_social
                WHERE p.dni = ?;
            `, [dni]);

            return obra_social;
        } catch (error) {
            console.error('Error fetching obrasocial:', error);
            throw new Error('Error al traer obrasocial desde el modelo');
        } finally {
            if (conn) conn.end();
        }
    }
    // update paciente
    static async updatePaciente(dni, updates) {
        console.log('Model Paciente: update paciente');
        try {
            // Verificar que updates no sea null, undefined o vacío
            if (!updates || Object.keys(updates).length === 0) {
                throw new Error('Datos de actualización inválidos');
            }
    
            const conn = await createConnection();
    
            // Construir la consulta de actualización dinámica
            const fields = [];
            const values = [];
            for (const [key, value] of Object.entries(updates)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
            values.push(dni); // Añadir el dni al final para la cláusula WHERE
    
            const query = `UPDATE pacientes SET ${fields.join(', ')} WHERE dni = ?;`;
            const [result] = await conn.query(query, values);
    
            console.log('Resultado de la consulta SQL:', result);
            console.log('Filas afectadas:', result.affectedRows);
    
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el paciente con el DNI proporcionado');
            }
    
            console.log('Model: paciente actualizado exitosamente');
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al modificar paciente desde el modelo:', error);
            throw new Error('Error al modificar paciente desde el modelo');
        }
    }
    // Delete logico
    //Inactivo
    static async inactivarPaciente(dni) {
        console.log('Model Paciente: inactivar paciente', dni);
        try {
            const conn = await createConnection();
            const query = 'UPDATE pacientes SET estado = 0 WHERE dni = ?';
            const [result] = await conn.query(query, [dni]);
    
            console.log('Resultado de la consulta SQL:', result);
            console.log('Filas afectadas:', result.affectedRows);
    
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el paciente con el dni proporcionado');
            }
    
            console.log('Model: paciente inactivado exitosamente');
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al inactivar paciente desde el modelo:', error);
            throw new Error('Error al inactivar paciente desde el modelo');
        }
    }
    
    //inactivo
    static async activarPaciente(dni) {
        console.log('Model Paciente: activar Paciente');
        try {
            const conn = await createConnection();
            const query = 'UPDATE pacientes SET estado = 1 WHERE dni = ?';
            const [result] = await conn.query(query, [dni]);
    
            console.log('Resultado de la consulta SQL:', result);
            console.log('Filas afectadas:', result.affectedRows);
    
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el paciente con el id proporcionado');
            }
    
            console.log('Model: paciente activado exitosamente');
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al activar paciente desde el modelo:', error);
            throw new Error('Error al activar paciente desde el modelo');
        }
    }
}
module.exports = Paciente;