function addTask() {
    const list = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.innerHTML = `
        <input type="checkbox" onchange="toggleComplete(this)">
        <input type="text" class="task-text" placeholder="Write your task...">
        <input type="datetime-local" class="task-datetime">
        <button class="delete-btn" onclick="deleteTask(this)">✖</button>
    `;
    list.appendChild(li);
    addDragAndDrop(li);
}

function toggleComplete(checkbox) {
    const textField = checkbox.nextElementSibling;
    if (checkbox.checked) {
        textField.classList.add("completed");
    } else {
        textField.classList.remove("completed");
    }
}

function deleteTask(btn) {
    btn.parentElement.remove();
}

// Drag and drop reordering
let draggedItem = null;

function addDragAndDrop(item) {
    item.addEventListener("dragstart", function() {
        draggedItem = this;
        setTimeout(() => this.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", function() {
        draggedItem = null;
        this.classList.remove("dragging");
    });
}

document.querySelectorAll("#todo-list li").forEach(addDragAndDrop);

document.getElementById("todo-list").addEventListener("dragover", function(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    if (afterElement == null) {
        this.appendChild(draggedItem);
    } else {
        this.insertBefore(draggedItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
