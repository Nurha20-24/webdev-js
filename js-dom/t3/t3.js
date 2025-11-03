'use strict';
const target = document.querySelector('#target ul');

const renderinfo = () => {
  target.innerHTML = '';

  const li = document.createElement('li');
  li.innerHTML = `Browser name, version, operating system name: ${navigator.userAgent}`;
  target.appendChild(li);

  const li2 = document.createElement('li');
  li2.innerHTML = `Screen (width / height): (${screen.width} / ${screen.height})`;
  target.appendChild(li2);

  const li3 = document.createElement('li');
  li3.innerHTML = `Available screen space for the browser: (${screen.availWidth} / ${screen.availHeight})`;
  target.appendChild(li3);

  const li4 = document.createElement('li');
  li4.innerHTML = `Current browser screen width and height: (${window.innerWidth} / ${window.innerHeight})`;
  target.appendChild(li4);

  const now = new Date();

  const date = now.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hour = now.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    hour12: false,
    timeZone: 'Europe/Helsinki',
  });

  const minutes = now.toLocaleTimeString('fi-FI', {
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Helsinki',
  });

  const p = document.createElement('p');
  p.innerHTML = `<br>Date: ${date} time: ${hour} : ${minutes}`;

  target.appendChild(p);
};

renderinfo();

// Re-render information on window resize
window.addEventListener('resize', renderinfo);
