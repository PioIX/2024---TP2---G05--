// Punto 1
async function traigoTablaUno() {
    const response = await fetch('http://localhost:7711/Jugadores',{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log(response)
    
    const result = await response.json()
    console.log(result)

    let tabla = `
        <tr>
            <th>id_jugador</th>
            <th>id_equipo</th>
            <th>nombre_jugador</th>
            <th>posicion</th>
            <th>nacionalidad</th>
            <th>feha_nacimiento</th>
            <th>.</th>
            <th>.</th>
        </tr>`;

    for (let i = 0; i < result.length; i++) {
        tabla += `
            <tr>
                <td>${result[i].id_jugador}</td>
                <td>${result[i].id_equipo}</td>
                <td>${result[i].nombre_jugador}</td>
                <td>${result[i].posicion}</td>
                <td>${result[i].nacionalidad}</td>
                <td>${result[i].fecha_nacimiento}</td>
                <td><button onclick="envioDelete('${result[i].nombre_jugador}')">Eliminar</button><td>
                <button onclick="envioPut('${result[i].id_jugador}')">Actualizar</button>
            </tr>
        `;
        
    }
    document.getElementById("tablaPunto1").innerHTML = tabla;
    document.getElementById("tablaPunto1").style.display = "block";
}
function escondoTabla(){
    document.getElementById("tablaPunto1").style.display = "none";
}

//Punto 2

async function envioPost() {
    // Armo un objeto para mandarlo como formato JSON
    const data = {
        id_equipo: document.getElementById("id_equipo").value,
        nombre_jugador: document.getElementById("nombre_jugador").value,
        posicion: document.getElementById("posicion").value,
        nacionalidad: document.getElementById("nacionalidad").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value
    };

    // Envio un pedido POST con un JSON en el body
    const response = await fetch('http://localhost:7711/InsertarJugadores',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data),
    });
    console.log(response);
}


//Punto 3

async function envioDelete(i) {
    let objeto = {
        nombre_jugador : i
    }

    const response = await fetch('http://localhost:7711/borrarJugadores',{
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(objeto),
    });
    console.log(response);
}

//Punto 4
async function envioPut(id_jugador) {
    let objeto = {
        id_jugador: id_jugador,
        id_equipo: document.getElementById("id_equipoDos").value,
        nombre_jugador: document.getElementById("nombre_jugadorDos").value,
        posicion: document.getElementById("posicionDos").value,
        nacionalidad: document.getElementById("nacionalidadDos").value,
        fecha_nacimiento: document.getElementById("fecha_nacimientoDos").value
    };

    const response = await fetch('http://localhost:7711/actualizarJugadores', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(objeto),
    });
}