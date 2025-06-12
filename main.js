


const input = document.getElementById("input-text");
const btnAdd = document.getElementById("btn-add");
const msgBox = document.getElementById("msg-box");
const listContainer = document.querySelector(".list-container ul");
const clearAllBtn = document.getElementById("clear-all");

//  Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToList(task));
   updateTaskCount()
});

// Add button click
btnAdd.addEventListener('click', () => {
  const inputValue = input.value.trim();

  if (inputValue === "") {
    showMessage("Please enter a task!:", "block", "red", 2500);
    return;
  }

  // Duplicate check
  let duplicate = false;
  const allItems = document.querySelectorAll(".task-text");
  allItems.forEach(item => {
    if (item.textContent.trim().toLowerCase() === inputValue.toLowerCase()) {
      duplicate = true;

    // Highlight the duplicate item
    const parentLi = item.closest("li");
    parentLi.style.backgroundColor = "#ff81a0"; // light red
    parentLi.scrollIntoView({ behavior: "smooth", block: "center" }); // focus
    parentLi.classList.add("shake"); // optional: animation (if defined in CSS)

    // Remove the highlight after 2.5 seconds
    setTimeout(() => {
      parentLi.style.backgroundColor = "";
      parentLi.classList.remove("shake");
    }, 3500);

    }
  });

  if (duplicate) {
    showMessage("This task already exists!:", "block", "crimson", 2500);
    return;
  }

  showMessage("You added a list item!:", "block", "green", 2500);

  // Add to UI
  addTaskToList(inputValue);
  updateTaskCount()

  //  Save to localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(inputValue);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
});

// Function to add task to UI with buttons
function addTaskToList(taskText) {
  const li = document.createElement("li");
  li.classList.add('list-item','fade-in');

  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <div class="btn-group">
      <button class="edit-btn"><i class="fa-solid fa-pen fa-beat icon-edit-btn"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash fa-beat icon-dlt-btn"></i></button>
    </div>
  `;

  //  Delete button logic
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    showMessage("One item is deleted from list:", "block", "red", 2500);

    //  Remove from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (listContainer.children.length === 0) {
      showMessage("All item is deleted:", "red", 2500);
    }
    updateTaskCount()
  });

  // Edit button logic
  li.querySelector('.edit-btn').addEventListener('click', () => {
    input.value = li.querySelector('.task-text').textContent.trim();
    li.remove();
    showMessage("List Item Is ready to edit:", "block", "green", 9500);

    //  Remove from localStorage so that after re-add it's not duplicate
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  // listContainer.appendChild(li); this is for old item on top

  listContainer.prepend(li); // this is for new item is top on list.
}

//  Clear All Button
clearAllBtn.addEventListener("click", () => {
  listContainer.innerHTML = "";
  localStorage.removeItem("tasks"); // Clear from localStorage
  showMessage("All item deleted", "block", "Red", 2500);
  updateTaskCount()
});

// Reusable message function
function showMessage(message, display = "block", color = "black", duration = 2500) {
  msgBox.textContent = message;
  msgBox.style.display = display;
  msgBox.style.color = color;

  setTimeout(() => {
    msgBox.textContent = "";
    msgBox.style.display = "none";
  }, duration);
}

// Task count updater
function updateTaskCount() {
  const count = document.querySelectorAll(".list-container ul li").length;
  document.getElementById("task-count").textContent = `Total Tasks: ${count}`;
}