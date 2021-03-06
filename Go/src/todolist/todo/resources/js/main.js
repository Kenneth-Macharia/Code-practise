const server = 'http://localhost:8000/';
const todolistServer = `${server}todo`;

window.addEventListener('load', () => {
  $.ajax({
    type: 'GET',
    url: `${server}/status`,
    success: (data) => {
      alert(data);
    },
    error: (err) => {
      alert(err.Description);
    },
  });
});

function getCompletedTodos() {
  let result = null;
  $.ajax({
    type: 'GET',
    url: `${todolistServer}/complete`,
    async: false,
    success: (data) => {
      result = data;
    },
  });
  return result;
}

function getIncompleteTodos() {
  let result = null;
  $.ajax({
    type: 'GET',
    url: `${todolistServer}/incomplete`,
    async: false,
    success: (data) => {
      result = data;
    },
  });
  return result;
}

const data = {
  todo: getIncompleteTodos() || [],
  completed: getCompletedTodos() || []
};

// Remove and complete icons in SVG format
const removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
const completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

function addItemToBackend(value) {
  let result = null;
  const payload = {
    description: value,
  };
  $.ajax({
    type: 'POST',
    url: todolistServer,
    data: payload,
    async: false,
    success: (data) => {
      result = data;
      console.log(data);
    },
  });
  return result.ID;
}

function removeItemInBackend(itemId) {
  $.ajax({
    url: `${todolistServer}/${itemId}`,
    type: 'DELETE',
    async: false,
    success: (data) => {
      console.log(data);
    },
  });
}

function updateItemInBackend(itemId, completed) {
  const payload = {
    completed,
  };
  $.ajax({
    url: `${todolistServer}/${itemId}`,
    type: 'PUT',
    data: payload,
    async: false,
    success: (data) => {
      console.log(data);
    },
  });
}

function completeItem() {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const parentClass = parent.getAttribute('class');
  const itemId = item.getAttribute('id')
  const value = item.innerText;

  if (parentClass === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
    updateItemInBackend(itemId, true);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
    updateItemInBackend(itemId, false);
  }

  // Check if the item should be added to the completed list or to re-added to the todo list
  const target = (parentClass === 'todo') ? document.getElementById('completed') : document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

function removeItem() {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const parentClass = parent.getAttribute('class');
  const itemId = item.getAttribute('id')
  const value = item.innerText;

  if (parentClass === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
  }
  parent.removeChild(item);
  removeItemInBackend(itemId);
}

// Adds a new item to the todo list
function addItemToDOM(text, id, completed) {
  const list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

  const item = document.createElement('li');
  item.innerText = text;
  item.id = id;

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  const complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}

function addItem(value) {
  const id = addItemToBackend(value);
  addItemToDOM(value, id);
  document.getElementById('item').value = '';

  data.todo.push(value);
}

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', () => {
  const { value } = document.getElementById('item');
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', (e) => {
  const { value } = this;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

function renderTodoList() {
  if (!data.todo.length && !data.completed.length) return;

  for (let i = 0; i < data.todo.length; i++) {
    const value = data.todo[i].Description;
    const id = data.todo[i].ID;
    addItemToDOM(value, id);
  }

  for (let j = 0; j < data.completed.length; j++) {
    const value = data.completed[j].Description;
    const id = data.completed[j].ID;
    addItemToDOM(value, id, true);
  }
}

renderTodoList();
