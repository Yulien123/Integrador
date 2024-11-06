const createConnection = require('../config/configDb');

class Especialidad {
    static async getAll() {
        let conn;
        try {
            conn = await createConnection();
            const [especialidades] = await conn.query('SELECT id, nombre FROM especialidades');
            return especialidades;
        } catch (error) {
            console.error('Error fetching especialidades:', error);
            throw new Error('Error al traer especialidades desde el modelo');
        } finally {
            if (conn) conn.end();
        }
    }
}

module.exports = Especialidad;
