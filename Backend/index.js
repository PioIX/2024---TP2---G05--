var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
const MySQL = require('./modulos/mysql')
const cors = require('cors');

var app = express(); //Inicializo express
var port = 7711
//process.env.PORT || 9999; //Ejecuto el servidor en el puerto 9999

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */
app.get('/saludo', function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    res.send(`Hello ${req.query.nombre}, ¿buen dia?`);
})

app.get('/Equipos', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Equipos;
    `)
    res.send(respuesta)
})

app.get('/Partidos', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Partidos;
    `)
    res.send(respuesta)
})

app.get('/Jugadores', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySQL.realizarQuery(`
    SELECT * FROM Jugadores;
    `)
    res.send(respuesta)
})

app.post('/nombreDelPedido', function(req,res) {
    console.log(req.body) 
    res.send("ok")
})

app.post('/InsertarEquipos', async function(req,res) {
    console.log(req.body) 
    result = await MySQL.realizarQuery(`SELECT * FROM Equipos WHERE nombre_equipo = '${req.body.nombre_equipo}' AND ciudad = '${req.body.ciudad}' AND año_fundacion = '${req.body.año_fundacion}'`);
    if (result.length > 0) {
        res.send("Ya existe")
    } else {
        await MySQL.realizarQuery(`INSERT INTO Equipos (nombre_equipo, ciudad, año_fundacion) VALUES ('${req.body.nombre_equipo}','${req.body.ciudad}','${req.body.año_fundacion}')`)
        res.send("ok")
    }
})

app.post('/InsertarPartidos', async function(req,res) {

    console.log(req.body) 
    result = await MySQL.realizarQuery(`SELECT * FROM Partidos WHERE fecha = '${req.body.fecha}' AND equipo_local = '${req.body.equipo_local}' AND equipo_visitante = '${req.body.equipo_visitante}' AND goles_local = '${req.body.goles_local}' AND goles_visitante = '${req.body.goles_visitante}'`);
    if (result.length > 0) {
        res.send("Ya existe")
    } else {
        await MySQL.realizarQuery(`INSERT INTO Partido (fecha, equipo_local, equipo_visitante, goles_local, goles_visitante) VALUES ('${req.body.fecha}','${req.body.equipo_local}','${req.body.equipo_visitante}','${req.body.goles_local}','${req.body.goles_visitante}')`);
        res.send("ok")
    }
})

app.post('/InsertarJugadores', async function(req,res) {
    console.log(req.body) 
    result = await MySQL.realizarQuery(`SELECT * FROM Jugadores WHERE nombre_jugador = '${req.body.nombre_jugador}' AND id_equipo = ${req.body.id_equipo} AND posicion = '${req.body.posicion}' AND nacionalidad = '${req.body.nacionalidad}' AND fecha_nacimiento = '${req.body.fecha_nacimiento}'`);
    if (result.length > 0) {
        res.send("Ya existe")
    } else {
        await MySQL.realizarQuery(`INSERT INTO Jugadores (id_equipo, nombre_jugador, posicion, nacionalidad, fecha_nacimiento) VALUES ('${req.body.id_equipo}', '${req.body.nombre_jugador}','${req.body.posicion}','${req.body.nacionalidad}', '${req.body.fecha_nacimiento}')`);
        res.send("ok")
    }
})

app.put('/actualizarPartidos', async function(req, res){
    console.log(req.body)
    await MySQL.realizarQuery(`UPDATE Partidos SET fecha = '${req.body.fecha}' WHERE id_partido = ${req.body.id_partido};`)
    res.send("ok")
})

app.put('/actualizarEquipos', async function(req, res){
    console.log(req.body)
    await MySQL.realizarQuery(`UPDATE Equipos SET nombre_ciudad = '${req.body.nombre_ciudad}' WHERE id_equipo = ${req.body.id_equipo};`)
    res.send("ok")
})

app.put('/actualizarJugadores', async function(req, res){
    console.log(req.body);
    const { id_jugador, id_equipo, nombre_jugador, Posicion, nacionalidad, fecha_nacimiento } = req.body;
    let result = await MySQL.realizarQuery(`SELECT * FROM Jugadores WHERE id_equipo = ${req.body.id_equipo}`);
    console.log("result es")
    console.log(result)
    if (result.length == 0) {
        res.send("error")
    } else {
        await MySQL.realizarQuery(`UPDATE Jugadores SET nombre_jugador = '${nombre_jugador}', id_equipo = ${id_equipo}, posicion = '${posicion}', nacionalidad = '${nacionalidad}', fecha_nacimiento = '${fecha_nacimiento}' WHERE id_jugador = ${id_jugador};`);
        res.send("ok");
    }
});



app.delete("/borrarEquipos", async function(req,res) {
	console.log(req.body)
	await MySQL.realizarQuery(`DELETE FROM Equipos WHERE nombre_equipo = '${req.body.nombre_equipo}';`)
	res.send("ok")
})

app.delete("/borrarPartidos", async function(req,res) {
	console.log(req.body)
	await MySQL.realizarQuery(`DELETE FROM Partidos WHERE id_partido = '${req.body.id_partido}';`)
	res.send("ok")
    await MySQL.realizarQuery(`DELETE FROM Partidos WHERE goles_visitantes = '${req.body.goles_visitantes}';`)
	res.send("ok")
})

app.delete("/borrarJugadores", async function(req,res) {
	console.log(req.body)
	await MySQL.realizarQuery(`DELETE FROM Jugadores WHERE nombre_jugador = '${req.body.nombre_jugador}';`)
	res.send("ok")
})


app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log(`   [GET] http://localhost:${port}/Equipos`);
    console.log(`   [GET] http://localhost:${port}/Partidos`);
    console.log(`   [GET] http://localhost:${port}/Jugadores`);
    console.log(`   [POST] http://localhost:${port}/Equipos`);
    console.log(`   [POST] http://localhost:${port}/Partidos`);
    console.log(`   [POST] http://localhost:${port}/InsertarJugadores`);
    console.log(`   [PUT] http://localhost:${port}/Equipos`);
    console.log(`   [PUT] http://localhost:${port}/Partidos`);
    console.log(`   [PUT] http://localhost:${port}/actualizarJugadores`);
    console.log(`   [DELETE] http://localhost:${port}/Equipos`);
    console.log(`   [DELETE] http://localhost:${port}/Partidos`);
    console.log(`   [DELETE] http://localhost:${port}/borrarJugadores`);


});