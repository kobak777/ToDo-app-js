import {
  saveTodosIntoLocalStorage,
  getTodosFromLocalStorage,
  getDateRepresentation,
} from "./utils.js";
const MAX_TODO_LENGTH = 30;
const addTodoInput = document.querySelector("[data-add-todo-input]");
const addTodoBtn = document.querySelector("[data-add-todo-btn]");
const todosContainer = document.querySelector("[data-todo-container]");
const todoTemplate = document.querySelector("[data-todo-template]");
const searchTodo = document.querySelector("[data-search-todo-input]");
const deleteCompletedBtn = document.querySelector(
  "[data-delete-completed-btn]"
);
const settingsWindow = document.querySelector("[data-settings-dialog]");
const settingsBtn = document.querySelector("[data-settings-btn]");
const themeSelect = document.querySelector("[data-theme-toggle]");
const saveSettingsBtn = document.querySelector("[data-save-settings-btn]");
const sortToogle = document.querySelector("[data-sort-toggle]");
const header = document.querySelector(".header");
const loadBackInput = document.querySelector("[data-load-back]");
const recoverBackgroundBtn = document.querySelector(
  "[data-recover-background]"
);
const defaultLightHeader =
  "https://sun9-61.userapi.com/c638818/v638818642/1e18f/hTp3h0GEHkM.jpg";
const defaultDarkHeader =
  "https://avatars.mds.yandex.net/i?id=f64ff3afe5e686d8b304c180d3f2d127fd05478d-5235735-images-thumbs&n=13";

let todoList = getTodosFromLocalStorage();
let filteredTodosList = [];
let pendingHeaderImage = null;

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
addTodoInput.addEventListener("input", () => {
  if (addTodoInput.value.length > MAX_TODO_LENGTH) {
    addTodoInput.value = addTodoInput.value.slice(0, MAX_TODO_LENGTH);
  }
});
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
  let todoText = addTodoInput.value.trim();
  if (todoText) {
    if (todoText.length > MAX_TODO_LENGTH) {
      todoText = todoText.slice(0, MAX_TODO_LENGTH);
    }
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: todoText,
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

addTodoInput.addEventListener("input", () => {
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

function applyCustomHeader(dataUrl) {
  header.style.backgroundImage = `url(${dataUrl})`;
  header.style.backgroundSize = "cover";
  header.style.backgroundPosition = "center";
  header.style.height = "150px";
}

function resetHeader(theme) {
  const url = theme === "dark" ? defaultDarkHeader : defaultLightHeader;
  header.style.backgroundImage = `url(${url})`;
  header.style.backgroundSize = "cover";
  header.style.backgroundPosition = "center";
  header.style.height = "150px";
}

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "auto";
  const savedHeader = localStorage.getItem("customHeader");
  if (savedHeader) {
    applyCustomHeader(savedHeader);
  } else {
    const themeToApply = savedTheme === "auto" ? getSystemTheme() : savedTheme;
    resetHeader(themeToApply);
  }
});

loadBackInput.addEventListener("change", () => {
  const file = loadBackInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    pendingHeaderImage = e.target.result;
  };
  reader.readAsDataURL(file);
});
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
saveSettingsBtn.addEventListener("click", () => {
  const selectedTheme = themeSelect.value;
  const selectedSorting = sortToogle.value;
  applyTheme(selectedTheme);
  localStorage.setItem("theme", selectedTheme);
  localStorage.setItem("sorting", selectedSorting);

  if (pendingHeaderImage) {
    localStorage.setItem("customHeader", pendingHeaderImage);
    applyCustomHeader(pendingHeaderImage);
    pendingHeaderImage = null;
  } else if (!localStorage.getItem("customHeader")) {
    const themeToApply =
      selectedTheme === "auto" ? getSystemTheme() : selectedTheme;
    resetHeader(themeToApply);
  }

  renderTodos();
});

recoverBackgroundBtn.addEventListener("click", () => {
  localStorage.removeItem("customHeader");
  pendingHeaderImage = null;

  let theme = localStorage.getItem("theme") || "auto";
  if (theme === "auto") {
    theme = getSystemTheme();
  }

  resetHeader(theme);
});
renderTodos();
