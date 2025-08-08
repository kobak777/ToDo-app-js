import {
  saveTodosIntoLocalStorage,
  getTodosFromLocalStorage,
  getDateRepresentation,
} from "./utils.js";

const addTodoInput = document.querySelector("[data-add-todo-input]");
const addTodoBtn = document.querySelector("[data-add-todo-btn]");
const todosContainer = document.querySelector("[data-todo-container]");
const todoTemplate = document.querySelector("[data-todo-template]");
const searchTodo = document.querySelector("[data-search-todo-input]");
const deleteCompletedBtn = document.querySelector(
  "[data-delete-completed-btn]"
);

let todoList = getTodosFromLocalStorage();
let filteredTodosList = [];

const renderTodos = () => {
  todosContainer.innerHTML = "";
  if (todoList.length === 0) {
    todosContainer.innerHTML = "<h3>Список задач пуст</h3>";
    return;
  }
  todoList.forEach((todo) => {
    const todoElement = createTodoLayout(todo);
    todosContainer.append(todoElement);
  });
};

const filterAndRenderFilteredTodos = (searchValue) => {
  filteredTodosList = todoList.filter((t) => {
    return t.text.includes(searchValue);
  });
  renderFilteredTodo();
};

const renderFilteredTodo = () => {
  todosContainer.innerHTML = "";
  if (filteredTodosList.length === 0) {
    todosContainer.innerHTML = "<h3>Задачи не найдены</h3>";
    return;
  }
  filteredTodosList.forEach((todo) => {
    const todoElement = createTodoLayout(todo);
    todosContainer.append(todoElement);
  });
};

const createTodoLayout = (todo) => {
  const todoElement = document.importNode(todoTemplate.content, true);
  const checkBox = todoElement.querySelector("[data-todo-checkbox]");
  checkBox.checked = todo.completed;

  const todoText = todoElement.querySelector("[data-todo-text]");
  todoText.textContent = todo.text;

  const todoCreatedDate = todoElement.querySelector("[data-todo-date]");
  todoCreatedDate.textContent = todo.createdAt;

  const removeTodoBtn = todoElement.querySelector("[data-remove-todo-btn]");
  removeTodoBtn.addEventListener("click", () => {
    todoList = todoList.filter((t) => {
      if (t.id !== todo.id) {
        return t;
      }
    });
    saveTodosIntoLocalStorage(todoList);
    if (searchTodo.value.trim()) {
      filterAndRenderFilteredTodos(searchTodo.value.trim());
    } else {
      renderTodos();
    }
  });

  checkBox.addEventListener("change", (e) => {
    todoList = todoList.map((t) => {
      if (t.id === todo.id) {
        t.completed = e.target.checked;
      }
      return t;
    });
    saveTodosIntoLocalStorage(todoList);
    if (searchTodo.value.trim()) {
      filterAndRenderFilteredTodos(searchTodo.value.trim());
    } else {
      renderTodos();
    }
  });
  return todoElement;
};

addTodoBtn.addEventListener("click", () => {
  if (addTodoInput.value.trim()) {
    const newTodo = {
      id: Date.now(), //поменять
      text: addTodoInput.value.trim(),
      completed: false,
      createdAt: getDateRepresentation(new Date()),
    };
    todoList.push(newTodo);
    addTodoInput.value = "";

    saveTodosIntoLocalStorage(todoList);
    renderTodos();
  }
});

searchTodo.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();
  filterAndRenderFilteredTodos(searchValue);
});

addTodoInput.addEventListener("input", (e) => {
  if (searchTodo.value.trim()) {
    searchTodo.value = "";
    renderTodos();
  }
});


deleteCompletedBtn.addEventListener("click", () => {
  const attention = confirm("Вы уверены?");
  if (attention) {
    todoList = todoList.filter((t) => {
      if (t.completed !== true) {
        return t;
      }
    });
    saveTodosIntoLocalStorage(todoList);
    if (searchTodo.value.trim()) {
      filterAndRenderFilteredTodos(searchTodo.value.trim());
    } else {
      renderTodos();
    }
  }
});


renderTodos();
