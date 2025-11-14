const restaurantRow = (restaurant) => {
  const {name, company, address, distance} = restaurant;

  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td>
  <td>${company}</td>
  <td>${address}</td>
  <td>~&nbsp;${distance ? distance.toFixed(1) : '?'}km</td>`;
  return tr;
};

const restaurantModal = (restaurant, menu) => {
  const {name, address, postalCode, city, phone, company} = restaurant;

  let menuHtml = '';
  if (menu && menu.courses) {
    menu.courses.forEach((course) => {
      const dietsHtml = course.diets
        ? `<div class="diets">${course.diets}</div>`
        : '';

      menuHtml += `
       <div class="menu-item">
       <strong>${course.name}</strong>
       <div class="price">${course.price || '?'}</div>
          ${dietsHtml}
          </div>`;
    });
  }

  return `
      <div class="modal-content">
            <h1>${name}</h1>
            <p><strong>Address: </strong>${address}</p>
            <p><strong>Postal Code: </strong>${postalCode}</p>
            <p><strong>City: </strong>${city}</p>
            <p><strong>Phone: </strong>${phone}</p>
            <p><strong>Company: </strong>${company}</p>
            <div class="menu-section">
            <h4>Today's Menu</h4>
              ${menuHtml || '<p>Menu not available</p>'}
            </div>
            <button onclick="this.closest('dialog').close()">Close</button>
            </div>`;
};

export {restaurantRow, restaurantModal};
