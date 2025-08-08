const TODOS_KEY = "todos";

export const saveTodosIntoLocalStorage = (todos) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const getTodosFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
};

export const getDateRepresentation = (date) => {
  return Intl.DateTimeFormat("ru-RU",{
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
};
