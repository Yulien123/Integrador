const express = require('express')
const bodyParser = require('body-parser')
const pug = require('pug')
const app = express()
const path = require('path');
const morgan = require('morgan')
const cors = require('cors');

const PORT = process.env.PORT ?? 3000

app.use(express.static(path.join(__dirname, 'public')));

const MedicosRouter = require('./routes/medicosRoutes');
const especialidadRoutes = require('./routes/especialidadRoutes');



app.set('view engine', 'pug')
app.set('views', 'views')



// Configurar Morgan para registrar solicitudes en la consola
//usar 'combined', 'common', 'dev', 'short', 'tiny' según tus necesidades
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error status:', res.statusCode);
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).send('Something broke!');
});


//gestion personas
//app.use('/personas', PersonasRouter)
//gestion usuarios
//app.use('/usuarios', UsuariosRouter)
//gestion medicos
app.use('/medicos', MedicosRouter);
//Gestion especialidades
app.use('/especialidad', especialidadRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})