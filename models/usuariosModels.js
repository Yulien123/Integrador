const createConnection = require('../config/configDb')
const Persona = require('./personasModels') //clase padre

class Usuario extends Persona {
    constructor(id, dni, nombre, apellido, nacimiento, email, password, id_rol) {
        super(dni, nombre, apellido, nacimiento)
        this.id = id
        this.email = email
        this.password = password
        this.id_rol = id_rol
    }

    static async get() {
        console.log('Model: Get All usuarios');
        try {
            const conn = await createConnection();
            const [usuarios] = await conn.query(`
                SELECT *
                FROM usuarios`);
            return usuarios
        } catch (error) {
            throw new Error('Error al traer usuarios desde el modelo', error);
        }
    }

    static async create({ dni, email, password, id_rol }) {
        console.log('Model: Create usuario');
        let conn;
        try {
            conn = await createConnection();
            const [result] = await conn.query(`
                    INSERT INTO usuarios (dni, email, password, id_rol)
                    VALUES (?, ?, ?, ?)
                `, [dni, email, password, id_rol]);

            if (result.affectedRows === 0) {
                throw new Error('Error al insertar en la tabla usuarios');
            }

            return { id: result.insertId, dni, email, password, id_rol };
        } catch (error) {
            console.error('Error creating usuario:', error);
            throw new Error('Error al crear usuario');
        } finally {
            if (conn) conn.end();
        }
    }
    //mostrar por dni y los telefonos del usuario
    static async getByDni(dni) {
        console.log(`Model: getByDni Usuario dni: ${dni}`);
        try {
            const conn = await createConnection();
            console.log('Conexión a la base de datos establecida');
    
            // Obtener el usuario por DNI
            const [usuario] = await conn.query('SELECT * FROM usuarios WHERE dni = ?', [dni]);
            
            if (!usuario || usuario.length === 0) {
                console.log('Model USUARIO: No se encontró ningún usuario');
                return { usuario: null, telefonos: null };
            }
    
            const { id } = usuario[0];
    
            // Obtener los teléfonos asociados al usuario
            const [telefonos] = await conn.query(`
                SELECT GROUP_CONCAT(DISTINCT t.numero SEPARATOR ', ') AS numeros
                FROM telefonos t
                WHERE t.id_usuario = ?;
            `, [id]);
    
            console.log('Model USUARIO: Resultado de la consulta:', usuario);
            console.log('Model: Resultado de la consulta:', telefonos);
    
            return { usuario: usuario[0], telefonos: telefonos[0] };
        } catch (error) {
            console.error('Error al obtener usuario por DNI:', error);
            throw error;
        }
    }
    
    //REVISAR NO FUNCIONA
    static async addTelefonoAlternativo(id, telefono) {
        try {
            const conn = await createConnection();
            console.log('Conexión a la base de datos establecida');
            await conn.query('INSERT INTO telefonos (id_usuario, numero) VALUES (?, ?)', [idUsuario, telefono]);
            console.log('Teléfono alternativo guardado en la base de datos');
        } catch (error) {
            console.error('Error al guardar el teléfono alternativo:', error);
            throw error;
        }
    }
    static async updateUsuario(dni, updates) {
        console.log('Model Usuario: update usuario');
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
    
            const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE dni = ?;`;
            const [result] = await conn.query(query, values);
    
            console.log('Resultado de la consulta SQL:', result);
            console.log('Filas afectadas:', result.affectedRows);
    
            if (result.affectedRows === 0) {
                throw new Error('No se encontró el usuario con el DNI proporcionado');
            }
    
            console.log('Model: Usuario actualizado exitosamente');
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al modificar usuarios desde el modelo:', error);
            throw new Error('Error al modificar usuarios desde el modelo');
        }
    }
    
    
    
/*
    static async update(persona) {
        console.log('Model: update persona')
        try {
            const conn = await createConnection()
            const { dni, nombre, apellido, nacimiento } = persona;
            //busca a la persona con ese dni para verificar que existe en la bd
            const [personaDni] = await conn.query('SELECT dni FROM personas WHERE dni = ?;', [dni])
            if (personaDni.length === 0) {
                console.log('Persona no encontrada')
                return false
            }
            console.log('Model: persona encontrada',personaDni[0])
            
            const [result] = await conn.query(
                'UPDATE personas SET dni = ?, nombre = ?, apellido = ?, nacimiento = ? WHERE dni = ?;',
                 [dni,nombre,apellido,nacimiento, dni])
            console.log('Model: Persona actualizada exitosamente')
            return result.affectedRows === 1
        } catch (error) {
            console.error('Error al modificar personas desde el modelo:', error);
            throw new Error('Error al modificar personas desde el modelo');
        }
    }

    static async delete( dni ) {
        console.log('Model: Delete persona')
        try {
            const conn = await createConnection()
            const [personaId] = await conn.query(
                'SELECT dni FROM personas WHERE dni = ?;',
                [dni]
            )
            const idDelete = personaId[personaId.length - 1]

            if (personaId.length === 0) {
                console.log('Persona no encontrada')
                return false
            }

            await conn.query(
                'DELETE FROM personas WHERE dni = ?;',
                [idDelete.dni]
            )
            console.log('Ha sido borrado con éxito')
        } catch (error) {
            //no se deberia mostrar el error al usuario por seguridad
            console.log(error)
            throw new Error('Error al borrar persona desde el modelo');

        }
        return true
    }*/
}

module.exports = Usuario