// Simulador de gestión de usuarios integrado con HTML/DOM

// Función constructora de Usuario
function Usuario(nombre, edad, email) {
    this.nombre = nombre;
    this.edad = edad;
    this.email = email;
    this.fechaCreacion = new Date().toISOString();
}

// Clase para gestionar usuarios
class GestorUsuarios {
    constructor() {
        // Inicializar array de usuarios desde localStorage o vacío
        this.usuarios = this.cargarUsuarios();
        this.setupEventListeners();
        this.actualizarTablaUsuarios();
    }

    // Método para cargar usuarios desde localStorage
    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
    }

    // Método para guardar usuarios en localStorage
    guardarUsuarios() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listener para el formulario de agregar usuario
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarUsuario();
        });

        // Event listener para el botón de búsqueda
        document.getElementById('btnBuscar').addEventListener('click', () => {
            this.buscarUsuarios();
        });

        // Event listener para búsqueda en tiempo real
        document.getElementById('busqueda').addEventListener('input', () => {
            this.buscarUsuarios();
        });

        // Delegación de eventos para botones de edición y eliminación
        document.getElementById('userList').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar')) {
                const index = e.target.dataset.index;
                this.eliminarUsuario(index);
            } else if (e.target.classList.contains('btn-editar')) {
                const index = e.target.dataset.index;
                this.prepararEdicionUsuario(index);
            }
        });
    }

    // Método para agregar un usuario
    agregarUsuario() {
        const nombreInput = document.getElementById('nombre');
        const edadInput = document.getElementById('edad');
        const emailInput = document.getElementById('email');
        const btnAgregar = document.getElementById('btnAgregar');
        
        const nombre = nombreInput.value.trim();
        const edad = parseInt(edadInput.value);
        const email = emailInput.value.trim();
        
        // Validar datos
        if (nombre && !isNaN(edad) && edad > 0 && email) {
            // Comprobar si estamos editando un usuario existente
            if (btnAgregar.dataset.editando) {
                const index = parseInt(btnAgregar.dataset.index);
                this.usuarios[index].nombre = nombre;
                this.usuarios[index].edad = edad;
                this.usuarios[index].email = email;
                
                // Restablecer el botón
                btnAgregar.textContent = 'Agregar Usuario';
                delete btnAgregar.dataset.editando;
                delete btnAgregar.dataset.index;
            } else {
                // Crear un nuevo usuario
                const nuevoUsuario = new Usuario(nombre, edad, email);
                this.usuarios.push(nuevoUsuario);
            }
            
            // Guardar en localStorage y actualizar la vista
            this.guardarUsuarios();
            this.actualizarTablaUsuarios();
            
            // Limpiar el formulario
            document.getElementById('userForm').reset();
        } else {
            // Mostrar error
            alert('Por favor, complete todos los campos correctamente.');
        }
    }

    // Método para eliminar un usuario
    eliminarUsuario(index) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            this.usuarios.splice(index, 1);
            this.guardarUsuarios();
            this.actualizarTablaUsuarios();
        }
    }

    // Método para preparar la edición de un usuario
    prepararEdicionUsuario(index) {
        const usuario = this.usuarios[index];
        
        // Rellenar el formulario con los datos del usuario
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('edad').value = usuario.edad;
        document.getElementById('email').value = usuario.email;
        
        // Cambiar el texto del botón y guardar el índice
        const btnAgregar = document.getElementById('btnAgregar');
        btnAgregar.textContent = 'Actualizar Usuario';
        btnAgregar.dataset.editando = 'true';
        btnAgregar.dataset.index = index;
        
        // Hacer scroll hasta el formulario
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Método para buscar usuarios
    buscarUsuarios() {
        const terminoBusqueda = document.getElementById('busqueda').value.toLowerCase();
        
        // Si no hay término de búsqueda, mostrar todos los usuarios
        if (!terminoBusqueda) {
            this.actualizarTablaUsuarios();
            return;
        }
        
        // Filtrar usuarios que coinciden con la búsqueda
        const usuariosFiltrados = this.usuarios.filter(usuario => 
            usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
            usuario.email.toLowerCase().includes(terminoBusqueda) ||
            usuario.edad.toString().includes(terminoBusqueda)
        );
        
        // Actualizar la tabla con los resultados filtrados
        this.actualizarTablaUsuarios(usuariosFiltrados);
    }

    // Método para actualizar la tabla de usuarios
    actualizarTablaUsuarios(usuariosAMostrar = this.usuarios) {
        const userList = document.getElementById('userList');
        const noUsers = document.getElementById('noUsers');
        const userTable = document.getElementById('userTable');
        
        // Limpiar la tabla actual
        userList.innerHTML = '';
        
        // Mostrar mensaje si no hay usuarios
        if (usuariosAMostrar.length === 0) {
            noUsers.classList.remove('hidden');
            userTable.classList.add('hidden');
        } else {
            noUsers.classList.add('hidden');
            userTable.classList.remove('hidden');
            
            // Generar filas para cada usuario
            usuariosAMostrar.forEach((usuario, index) => {
                const row = document.createElement('tr');
                
                // Crear celdas para cada propiedad
                const propiedades = ['nombre', 'edad', 'email'];
                propiedades.forEach(prop => {
                    const cell = document.createElement('td');
                    cell.textContent = usuario[prop];
                    row.appendChild(cell);
                });
                
                // Crear celda para los botones de acción
                const actionsCell = document.createElement('td');
                
                // Botón de editar
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'btn-editar';
                editBtn.dataset.index = this.usuarios.indexOf(usuario);
                
                // Botón de eliminar
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.className = 'btn-eliminar';
                deleteBtn.dataset.index = this.usuarios.indexOf(usuario);
                
                // Agregar botones a la celda
                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(deleteBtn);
                row.appendChild(actionsCell);
                
                // Agregar la fila a la tabla
                userList.appendChild(row);
            });
        }
    }

    // Método para filtrar usuarios por criterio
    filtrarUsuarios(criterio, valor) {
        return this.usuarios.filter(usuario => {
            if (typeof usuario[criterio] === 'string') {
                return usuario[criterio].toLowerCase().includes(valor.toLowerCase());
            } else {
                return usuario[criterio] == valor;
            }
        });
    }
}

// Iniciar el gestor de usuarios cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const gestorUsuarios = new GestorUsuarios();
});