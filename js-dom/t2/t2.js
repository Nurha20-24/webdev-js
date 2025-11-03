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

const ul = document.querySelector('ul');

todoList.forEach((item) => {
  let li = document.createElement('li');
  let checkbox = document.createElement('input');

  checkbox.type = 'checkbox';
  checkbox.id = `todo-${item.id}`;

  checkbox.checked = item.completed;

  let label = document.createElement('label');
  label.innerText = item.task;
  label.htmlFor = `todo-${item.id}`;

  label.addEventListener('click', () => {
    alert('clicked!');
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  ul.appendChild(li);
});
