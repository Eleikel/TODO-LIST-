

window.addEventListener('load', () => {

    //!Variable local donde se almacenaran todos los datos
    todosDb = JSON.parse(localStorage.getItem('tareas')) || [];

    const nombreInput = document.querySelector('#nombre');
    const FormularioTodo = document.querySelector('#nuevo-formulario-todo');

    const nombreUsuario = localStorage.getItem('usuario') || '';

    nombreInput.value = nombreUsuario;

    //! Cuando se cambia el input del nombre este se almacena automaticamente
    nombreInput.addEventListener('change', (e) => {
        localStorage.setItem('usuario', e.target.value)
    });

    FormularioTodo.addEventListener('submit', (e) => {
        e.preventDefault();

        //! Almacenar todo esto al localStorage
        const todo = {
            contenido: e.target.elements.contenido.value,
            categoria: e.target.elements.categoria.value,
            realizada: false,
            createAt: new Date().getTime()
        }

        //! Verificar que el input de tarea y categoria no esten vacios
        if (e.target.elements.contenido.value != '') {
            if (e.target.elements.categoria.value != '') {
                
                todosDb.push(todo);
                localStorage.setItem('tareas', JSON.stringify(todosDb))

                //? SweetAlert cuando se guarda
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Tarea Añadida',
                    showConfirmButton: false,
                    timer: 1500
                });

                //! Limpiar O Resetear los inputs
                e.target.reset();

                MostrarTodos();
            }
            else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Por favor, Ingresa una categoria',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
        else {
            Swal.fire({
                title: 'Error!',
                text: 'Por favor, Ingresa una tarea',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }


    });

    MostrarTodos();
});


function MostrarTodos() {

    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    todosDb.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const contenido = document.createElement('div');
        const accion = document.createElement('div');
        const btnEditar = document.createElement('button');
        const btnEliminar = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.realizada;
        span.classList.add('circulo');
        

        if (todo.categoria == 'personal') {
            span.classList.add('personal');

        } else if (todo.categoria == 'trabajo') {
            span.classList.add('trabajo');

        } else {
            span.classList.add('grupal');
        }

        contenido.classList.add('todo-contenido');
        accion.classList.add('accion');
        btnEditar.classList.add('editar');
        btnEliminar.classList.add('eliminar');

        contenido.innerHTML = `<input type="text" value="${todo.contenido}" readonly>`;
        btnEditar.innerHTML = 'EDITAR';
        btnEliminar.innerHTML = 'ELIMINAR';

        label.appendChild(input);
        label.appendChild(span);
        accion.appendChild(btnEditar);
        accion.appendChild(btnEliminar);
        todoItem.appendChild(label);
        todoItem.appendChild(contenido);
        todoItem.appendChild(accion);

        todoList.append(todoItem);

        if (todo.realizada) {
            todoItem.classList.add('realizada');
        }

        input.addEventListener('click', (e) => {
            todo.realizada = e.target.checked;
            localStorage.setItem('tareas', JSON.stringify(todosDb));

            //! Marcar/Desmarcar Tareas realizadas
            if (todo.realizada) {
                todoItem.classList.add('realizada');
            } else {
                todoItem.classList.remove('realizada');
            }
            MostrarTodos();
        });

        //! Boton Editar

        btnEditar.addEventListener('click', e => {
            const input = contenido.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();

            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.contenido = e.target.value;
                localStorage.setItem('tareas', JSON.stringify(todosDb));
                MostrarTodos();
            });
        });

        //! Eliminar

        btnEliminar.addEventListener('click', e => {
            todosDb = todosDb.filter(element => element != todo);
            localStorage.setItem('tareas', JSON.stringify(todosDb));
            MostrarTodos();
        });
    });

};