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
const deleteCompletedBtn = document.querySelector("[data-delete-completed-btn]");

const settingsWindow = document.querySelector("[data-settings-dialog]");
const settingsBtn = document.querySelector("[data-settings-btn]");

const themeSelect = document.querySelector("[data-theme-toggle]");
const saveSettingsBtn = document.querySelector("[data-save-settings-btn]");

const sortToogle = document.querySelector("[data-sort-toggle]");

let todoList = getTodosFromLocalStorage();
let filteredTodosList = [];

const renderTodos = () => {
  todosContainer.innerHTML = "";
  if (todoList.length === 0) {
    todosContainer.innerHTML = "<h3>Список задач пуст</h3>";
    return;
  }
  const sorting = localStorage.getItem("sorting") || "by-alpha"; 
  const sortedList = sortTodos(todoList, sorting);

  sortedList.forEach((todo) => {
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
  const sorting = localStorage.getItem("sorting") || "by-alpha";
  const sortedList = sortTodos(filteredTodosList, sorting);
  sortedList.forEach((todo) => {
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
  todoCreatedDate.textContent = getDateRepresentation(new Date(todo.createdAt));

  const removeTodoBtn = todoElement.querySelector("[data-remove-todo-btn]");
  removeTodoBtn.addEventListener("click", () => {
    todoList = todoList.filter((t) => t.id !== todo.id);
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
      id: Math.floor(Math.random() * 1000000),
      text: addTodoInput.value.trim(),
      completed: false,
      createdAt: new Date().toISOString(), 
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
    todoList = todoList.filter((t) => !t.completed);
    saveTodosIntoLocalStorage(todoList);
    if (searchTodo.value.trim()) {
      filterAndRenderFilteredTodos(searchTodo.value.trim());
    } else {
      renderTodos();
    }
  }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
  themeSelect.value = savedTheme;
} else {
  themeSelect.value = "auto";
}

saveSettingsBtn.addEventListener("click", function () {
  const selectedTheme = themeSelect.value;
  const selectedSorting = sortToogle.value;
  applyTheme(selectedTheme);
  localStorage.setItem("theme", selectedTheme);
  localStorage.setItem("sorting", selectedSorting);
  renderTodos(); 
});

function applyTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  if (theme === "light") {
    document.body.classList.add("light-theme");
  } else if (theme === "dark") {
    document.body.classList.add("dark-theme");
  }
}

function sortTodos(list, sorting) {
  if (sorting === "by-alpha") {
    return [...list].sort((a, b) => a.text.localeCompare(b.text));
  } else if (sorting === "by-date") {
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  return list;
}

settingsBtn.addEventListener("click", () => {
  settingsWindow.showModal();
});

renderTodos();
