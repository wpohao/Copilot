const STORAGE_KEY = "todo-list-items";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const filterButtons = document.querySelectorAll(".filter-button");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const THEME_STORAGE_KEY = "todo-list-theme";
const EMPTY_MESSAGES = {
  all: "還沒有任何待辦事項，新增一個吧!",
  active: "目前沒有符合「未完成」篩選的事項；其他待辦仍保留在「全部」清單中，並未刪除。",
  completed: "目前沒有符合「已完成」篩選的事項；其他待辦仍保留在「全部」清單中，並未刪除。",
};

let activeFilter = "all";
let themePreference = loadThemePreference();
let currentTheme = "light";

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

// 讀取使用者手動選擇的主題；沒有有效設定時改用系統偏好。
function loadThemePreference() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch (error) {
    console.error("無法讀取已儲存的主題設定：", error);
    return null;
  }
}

// 套用主題並同步切換按鈕的圖示、文字與狀態。
function applyTheme() {
  currentTheme = themePreference || (systemTheme.matches ? "dark" : "light");
  document.documentElement.dataset.theme = currentTheme;
  const isDark = currentTheme === "dark";

  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

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

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === "active") {
      return !todo.completed;
    }

    if (activeFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  for (const todo of visibleTodos) {
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

  emptyMessage.hidden = visibleTodos.length > 0;
  emptyMessage.textContent =
    todos.length === 0 && activeFilter === "all"
      ? EMPTY_MESSAGES.all
      : EMPTY_MESSAGES[activeFilter];
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

themeToggle.addEventListener("click", () => {
  themePreference = currentTheme === "dark" ? "light" : "dark";

  try {
    localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  } catch (error) {
    console.error("無法儲存主題設定：", error);
  }

  applyTheme();
});

systemTheme.addEventListener("change", () => {
  if (!themePreference) {
    applyTheme();
  }
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    }

    renderTodos();
  });
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

applyTheme();
renderTodos();
