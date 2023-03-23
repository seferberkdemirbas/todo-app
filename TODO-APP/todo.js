
// değişkenler
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const unCompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('sound.mp3');

// ilk açılışta yapılacaklar listesini alın
window.onload = () => {
  let storageTodoItems = localStorage.getItem('todoItems')
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems)
  }

  render()
}

// girdiğe yazılan içeriği alın
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode == 13) { // Enter
    addTodo(value)

    todoInput.value = ''
    todoInput.focus()
  }
};

// yapılacak iş ekle
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false
  })

  saveAndRender()
}


// yapılan işi sil
function removeTodo(id) {
  todoItems = todoItems.filter(todo => todo.id !== Number(id))
  saveAndRender()
}



//tamamlandı olarak işaretle
function markAsCompleted(id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = true
    }

    return todo
  })

  audio.play(); // tamamlandığında ses çal

  saveAndRender()
}

// tamamlanmadı olarak işaretle
function markAsUncompleted(id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = false
    }

    return todo
  })

  saveAndRender()
}

// yerel depolamaya kaydet
function save() {
  localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
  let unCompletedTodos = todoItems.filter(item => !item.completed)
  let completedTodos = todoItems.filter(item => item.completed)

  completedTodosDiv.innerHTML = ''
  unCompletedTodosDiv.innerHTML = ''

  if (unCompletedTodos.length > 0) {
    unCompletedTodos.forEach(todo => {
      unCompletedTodosDiv.append(createTodoElement(todo))
    })
  } else {
    unCompletedTodosDiv.innerHTML = `<div class='empty'>TAMAMLANMAMIŞ GÖREV YOK ✔️ </div>`
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'>Tamamlandı (${completedTodos.length} / ${todoItems.length})</div>`

    completedTodos.forEach(todo => {
      completedTodosDiv.append(createTodoElement(todo))
    })
  }
}

// kaydet ve oluştur
function saveAndRender() {
  save()
  render()
}



// yapılacaklar listesi öğesi oluştur
function createTodoElement(todo) {
  // yapılacaklar listesi kabı oluştur
  const todoDiv = document.createElement("DIV");
  todoDiv.setAttribute('data-id', todo.id)
  todoDiv.className = "todo-item";

  // yapılacaklar öğesi metni oluştur
  const todoTextDiv = document.createElement("SPAN");
  todoTextDiv.innerHTML = todo.text;

  // liste için onay kutusu
  const todoInputCheckbox = document.createElement("INPUT");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
  }
  // yapılacak işi düzenle
function editTodo(id, newText) {
  todoItems = todoItems.map(todo => {
    if (todo.id === Number(id)) {
      todo.text = newText;
    }
    return todo;
  });
  saveAndRender();
}

// yapılacak işi düzenleme formunu aç
function openEditForm(todoDiv) {
  const todoText = todoDiv.querySelector('span');
  const todoId = todoDiv.getAttribute('data-id');
  
  const editForm = document.createElement('form');
  editForm.innerHTML = `
    <input type="text" value="${todoText.innerText}">
    <button type="submit">Kaydet</button>
  `;
  
  editForm.onsubmit = (e) => {
    e.preventDefault();
    const newText = e.target.querySelector('input').value;
    editTodo(todoId, newText);
    todoDiv.removeChild(editForm);
  };
  
  todoDiv.appendChild(editForm);
}



  // edit butonu 

  const todoEditBtn = document.createElement("A");
  todoEditBtn.href = "#";
  todoEditBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#3276c3" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 348.882 348.882" xml:space="preserve" stroke="#3276c3">

  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  
  <g id="SVGRepo_iconCarrier"> <g> <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231 c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685 c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176 C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99 L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386 c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"/> <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904 c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15 s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798 c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"/> </g> </g>
  
  </svg>`;
  todoEditBtn.onclick = (e) => {
    e.preventDefault();
    openEditForm(todoDiv);
  };
  todoDiv.appendChild(todoEditBtn);
 



  // liste için sil butonu
  const todoRemoveBtn = document.createElement("A");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
     <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
     <line x1="18" y1="6" x2="6" y2="18"></line>
     <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id
    removeTodo(id)
  };

  todoTextDiv.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextDiv);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv
}