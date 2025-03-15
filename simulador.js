// Simulador de gestión de usuarios en la consola

// Declaración de variables y array de usuarios
const usuarios = [];

// Función para agregar un usuario
function agregarUsuario() {
    let nombre = prompt("Ingrese el nombre del usuario:");
    let edad = parseInt(prompt("Ingrese la edad del usuario:"));
    if (nombre && !isNaN(edad)) {
        usuarios.push({ nombre, edad });
        console.log(`Usuario agregado: ${nombre}, ${edad} años`);
    } else {
        alert("Datos inválidos, intente de nuevo.");
    }
}

// Función para eliminar un usuario por nombre
function eliminarUsuario() {
    let nombre = prompt("Ingrese el nombre del usuario a eliminar:");
    let index = usuarios.findIndex(usuario => usuario.nombre.toLowerCase() === nombre.toLowerCase());
    if (index !== -1) {
        usuarios.splice(index, 1);
        console.log(`Usuario ${nombre} eliminado.`);
    } else {
        alert("Usuario no encontrado.");
    }
}

// Función para listar usuarios
function listarUsuarios() {
    if (usuarios.length === 0) {
        console.log("No hay usuarios registrados.");
    } else {
        console.log("Lista de usuarios:");
        usuarios.forEach((usuario, index) => {
            console.log(`${index + 1}. ${usuario.nombre} - ${usuario.edad} años`);
        });
    }
}

// Menú de interacción con el usuario
function menu() {
    let opcion;
    do {
        opcion = prompt("Seleccione una opción:\n1. Agregar usuario\n2. Eliminar usuario\n3. Listar usuarios\n4. Salir");
        switch (opcion) {
            case "1":
                agregarUsuario();
                break;
            case "2":
                eliminarUsuario();
                break;
            case "3":
                listarUsuarios();
                break;
            case "4":
                alert("Saliendo del sistema.");
                break;
            default:
                alert("Opción inválida, intente nuevamente.");
        }
    } while (opcion !== "4");
}

// Iniciar el simulador
menu();
