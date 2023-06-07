let todoItems = [
  { category: 'work', todos: [] },
  { category: 'personal', todos: [] },
  { category: 'home', todos: [] },
  { category: 'school', todos: [] },
  { category: 'other', todos: [] }
];

const todoInput = document.querySelector('.todo-input');
const categorySelect = document.querySelector('#category');
const completedTodosDiv = document.querySelector('.completed-todos');
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos');
const audio = new Audio('sound.mp3');

// İlk açılışta yapılacaklar listesini alın
window.onload = () => {
  let storageTodoItems = localStorage.getItem('todoItems');
  if (storageTodoItems !== null) {
    const storedItems = JSON.parse(storageTodoItems);
    // Mevcut kategorileri döngü ile güncelleyin
    for (let i = 0; i < todoItems.length; i++) {
      const category = todoItems[i].category;
      if (storedItems.hasOwnProperty(category)) {
        todoItems[i].todos = storedItems[category].todos;
      }
    }
  }

  render();
};

// Girdiğe yazılan içeriği alın
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, '');
  if (value && e.keyCode == 13) {
    // Enter
    addTodo(value);

    todoInput.value = '';
    todoInput.focus();
  }
};

// Yapılacak iş ekle
function addTodo(text) {
  const selectedCategory = categorySelect.value;

  const categoryIndex = todoItems.findIndex(item => item.category === selectedCategory);
  if (categoryIndex !== -1) {
    const todoId = Date.now();
    const newTodo = { id: todoId, text, completed: false };
    todoItems[categoryIndex].todos.push(newTodo);
    saveAndRender();
  }
}




// Yapılacak işi düzenle
function editTodo(todoId, newText, category) {
  const targetCategory = todoItems.find(item => item.category === category);
  if (targetCategory) {
    const todo = targetCategory.todos.find(todo => todo.id === todoId);
    if (todo) {
      todo.text = newText;
    }
  }
  saveAndRender();
}

// Yapılacak işi sil
function removeTodo(todoId, category) {
  const targetCategory = todoItems.find(item => item.category === category);
  if (targetCategory) {
    const todoIndex = targetCategory.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
      targetCategory.todos.splice(todoIndex, 1);
    }
  }
  saveAndRender();
}

// tamamlandı olarak işaretle
function markAsCompleted(id) {
  for (const category of todoItems) {
    const todo = category.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = true;
      break;
    }
  }
  audio.play();
  saveAndRender();
}

function markAsUncompleted(id) {
  for (const category of todoItems) {
    const todo = category.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = false;
      break;
    }
  }
  saveAndRender();
}

// Yerel depolamaya kaydet
function save() {
  const storedItems = {};
  for (const category of todoItems) {
    const { todos } = category;
    storedItems[category.category] = { todos };
  }
  localStorage.setItem('todoItems', JSON.stringify(storedItems));
}

// Yapılacakları görüntüle
function render() {
  completedTodosDiv.innerHTML = '';
  uncompletedTodosDiv.innerHTML = '';

  for (const category of todoItems) {
    const { category: categoryName, todos } = category;

    const categoryHeader = document.createElement('h3');
    categoryHeader.innerText = categoryName;
    completedTodosDiv.appendChild(categoryHeader.cloneNode(true));

    const uncompletedCategoryHeader = document.createElement('h3');
    uncompletedCategoryHeader.innerText = categoryName;
    uncompletedTodosDiv.appendChild(uncompletedCategoryHeader.cloneNode(true));

    for (const todo of todos) {
      const { id, text, completed } = todo;

      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      todoItem.innerHTML = `
        <input
          type="checkbox"
          class="todo-checkbox"
          ${completed ? 'checked' : ''}
          onchange="handleChange(event, ${id})"
        />
        <div class="todo-text">
          ${completed ? `<del>${text}</del>` : text}
        </div>
        <div class="todo-actions">
          <button class="edit-button" onclick="editTodoPrompt(${id}, '${categoryName}')">Düzenle</button>
          <button class="remove-button" onclick="removeTodoConfirm(${id}, '${categoryName}')">Sil</button>
        </div>
      `;

      if (completed) {
        completedTodosDiv.appendChild(todoItem);
      } else {
        uncompletedTodosDiv.appendChild(todoItem);
      }
    }
  }
}

// Yapılacak işi düzenleme için bir giriş kutusu göster
function editTodoPrompt(todoId, category) {
  const targetCategory = todoItems.find(item => item.category === category);
  if (targetCategory) {
    const todo = targetCategory.todos.find(todo => todo.id === todoId);
    if (todo) {
      const newText = prompt('Yeni metni girin:', todo.text);
      if (newText !== null) {
        editTodo(todoId, newText, category);
      }
    }
  }
}

// Yapılacak işi silme için bir onay kutusu göster
function removeTodoConfirm(todoId, category) {
  const confirmation = confirm('Bu yapılacak işi silmek istediğinize emin misiniz?');
  if (confirmation) {
    removeTodo(todoId, category);
  }
}

// Tamamlanma durumunu değiştirme
function handleChange(event, todoId) {
  if (event.target.checked) {
    markAsCompleted(todoId);
  } else {
    markAsUncompleted(todoId);
  }
}

// Yapılacakları kaydet ve görüntüle
function saveAndRender() {
  save();
  render();
}

