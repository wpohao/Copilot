const STORAGE_KEY = "todo-list-items";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");

// 從瀏覽器儲存空間讀取並檢查待辦資料。
function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      throw new TypeError("待辦資料格式不正確。");
    }

    return parsedTodos.filter(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean",
    );
  } catch (error) {
    console.error("無法讀取已儲存的待辦事項：", error);
    return [];
  }
}

let todos = loadTodos();

// 儲存目前清單；儲存失敗時在主控台明確回報錯誤。
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("無法儲存待辦事項：", error);
  }
}

// 依照目前資料更新清單、空狀態提示與未完成數量。
function renderTodos() {
  list.replaceChildren();

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";

    if (todo.completed) {
      item.classList.add("is-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為已完成`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  }

  emptyMessage.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  form.reset();
  input.focus();
});

renderTodos();
