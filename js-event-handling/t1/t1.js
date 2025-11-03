// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

// add your code here

// Get Dom elements
const ul = document.querySelector('ul');
const addButton = document.querySelector('.add-btn');
const dialog = document.querySelector('dialog');
const inputField = document.querySelector('input');
const form = document.querySelector('form');

// Function to render the todoList
const renderList = () => {
  ul.innerHTML = '';

  todoList.forEach((item) => {
    let li = document.createElement('li');

    // Create checkbox input element
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-${item.id}`;
    checkbox.checked = item.completed;

    if (item.completed) {
      checkbox.setAttribute('checked', '');
    } else {
      checkbox.removeAttribute('checked');
    }

    // Create label for the task
    let label = document.createElement('label');
    label.innerText = item.task;
    label.htmlFor = `todo-${item.id}`;

    // Update todoList array when checkBox state changes
    checkbox.addEventListener('change', (event) => {
      item.completed = checkbox.checked;
      console.log(`Clicked: `, event.target.checked);
      console.log(`Updated todoList:`, todoList);
    });

    li.appendChild(checkbox);
    li.appendChild(label);

    // Create delete button for each task
    const delButton = document.createElement('button');
    delButton.textContent = 'X';
    li.appendChild(delButton);

    // handle delete button click -remove item from todoList
    delButton.addEventListener('click', () => {
      const indexOfDeletedItem = todoList.findIndex(
        (arrayItem) => arrayItem == item
      );

      // Remove item from array and get the deleted item
      const deletedItem = todoList.splice(indexOfDeletedItem, 1);
      console.log(
        'Deleted item: ',
        deletedItem,
        'Updated todoList: ',
        todoList
      );
      // Remove the list item from the dom
      ul.removeChild(li);
    });
    ul.appendChild(li);
  });
};

// Event Listener for add button
addButton.addEventListener('click', () => {
  dialog.showModal();
  inputField.value = '';
});

// Form submit event listener
form.addEventListener('submit', (event) => {
  event.preventDefault();

  todoList.push({
    id: todoList.length + 1,
    task: inputField.value,
    completed: false,
  });

  dialog.close();
  console.log('New todoList: ', todoList);
  renderList();
});
// Initial render of the todo list
renderList();
