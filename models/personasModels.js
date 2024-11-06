const createConnection = require('../config/configDb')

class Persona {
    constructor(dni, nombre, apellido, nacimiento) {
        this.dni = dni
        this.nombre = nombre
        this.apellido = apellido
        this.nacimiento = nacimiento
    }

    static async get() {
        console.log('Model: Get All personas')
        try {
            const conn = await createConnection()
            const [personas] = await conn.query('select * from personas')
            return personas
        } catch (error) {
            throw new Error('Error al traer personas desde el modelo', error)
        }//Hacer validaciones etc
    }

    static async getById(dni) {
        console.log('Model: Get Id persona ')
        try {
            const conn = await createConnection()
            const [personas] = await conn.query('SELECT * FROM personas WHERE dni = ?', [dni])
            if (personas.length === 0) return null
            return personas
        } catch (error) {
            throw new Error('Error al traer personas desde el modelo', error)
        }
    }

    static async create(persona) {
        console.log('Model: Create Persona');
        try {
            const conn = await createConnection();
            const { dni, nombre, apellido, nacimiento } = persona;
            //Verifica duplicados
            const [verificacion] = await conn.query(
                'SELECT dni FROM personas WHERE dni = ?;',
                [dni]
            )

            if (verificacion.length > 0) {
                console.error('Model: DNI duplicado para persona', dni)
                return false
            }

            const [result] = await conn.query(
                'INSERT INTO personas (dni, nombre, apellido, nacimiento) VALUES (?, ?, ?, ?)',
                [dni, nombre, apellido, nacimiento]
            );
            console.log('Model: Persona Insertado en tabla desde el modelo');
            return result.affectedRows === 1; // Devuelve true si se insertó correctamente
        } catch (error) {
            console.error('Error al crear personas desde el modelo:', error);
            throw new Error('Error al crear personas desde el modelo');
        }
    }

    static async getByDni(dni) {
        console.log(`Model: getByDni Persona dni: ${dni}`)
        try {
            const conn = await createConnection();
            console.log('Conexión a la base de datos establecida');
            const [rows] = await conn.query('SELECT * FROM personas WHERE dni = ?', [dni]);
            //console.log('Model: Resultado de la consulta:', rows);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener persona por DNI:', error);
            throw error;
        }
    }

    static async updatePersona(dni, updates) {
        console.log('Model Persona: update persona');
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
    
            const query = `UPDATE personas SET ${fields.join(', ')} WHERE dni = ?;`;
            const [result] = await conn.query(query, values);
    
            console.log('Model: Persona actualizada exitosamente');
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al modificar personas desde el modelo:', error);
            throw new Error('Error al modificar personas desde el modelo');
        }
    }
    
    static async delete(dni) {
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
    }
}

module.exports = Persona