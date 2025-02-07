document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskText = document.getElementById("task").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!taskText || !deadline) {
    alert("All fields are mandatory");
    return;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  if (deadline < currentDate) {
    alert("Deadline cannot be a past date");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    priority,
    deadline,
    done: false,
  };

  createTaskElement(task);
  saveTask(task);

  document.getElementById("task").value = "";
  document.getElementById("deadline").value = "";
}

function createTaskElement(task) {
  const taskList = document.getElementById("taskList");
  const taskcard = document.createElement("div");
  taskcard.className = `task-card ${task.done ? "done" : ""}`;
  taskcard.dataset.id = task.id;

  let priorityClass = "";
  if (task.priority === "top") priorityClass = "priority-top";
  else if (task.priority === "middle") priorityClass = "priority-middle";
  else priorityClass = "priority-low";

  taskcard.innerHTML = `
 <div class="task-details">
<strong>${task.text}</strong>
<span class="${priorityClass}">priority:${task.priority}</span>
<span>deadline:${task.deadline}</span>
 </div>
 <div class="task-actions">
<button class="mark-done"> ${task.done ? "completed" : "Mark Done"}</button>
<button class="delete-task">Delete</button>
 </div>
 `;

  taskcard.querySelector(".mark-done").addEventListener("click", () => {
    taskcard.classList.toggle("done");
    task.done = !task.done;
    updateTask(task);
  });

  taskcard.querySelector(".delete-task").addEventListener("click", () => {
    deleteTask(task.id);
  });
  taskList.appendChild(taskcard);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(createTaskElement);
}

function updateTask(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskId){
    let tasks=JSON.parse(localStorage.getItem('tasks'))||[];
    tasks=tasks.filter(task=>task.id!==taskId);
    localStorage.setItem('tasks',JSON.stringify(tasks));

    const taskcard=document.querySelector(`.task-card[data-id="${taskId}"]`);
    if(taskcard){
        taskcard.classList.add("fade-out");
        setTimeout(()=>taskcard.remove(),300)
    }
}
