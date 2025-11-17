const restaurantRow = (restaurant, isFavorite = false) => {
  const {name, company, address, distance} = restaurant;

  const tr = document.createElement('tr');

  if (isFavorite) {
    tr.classList.add('favorite-restaurant');
  }

  const starIcon = isFavorite ? '<span class="favorite-star">⭐</span> ' : '';

  tr.innerHTML = `
  <td>${starIcon}${name}</td>
  <td>${company}</td>
  <td>${address}</td>
  <td>~&nbsp;${distance ? distance.toFixed(1) : '?'}km</td>`;
  return tr;
};

const restaurantModal = (restaurant, menu, isFavorite = false) => {
  const {name, address, postalCode, city, phone, company} = restaurant;

  const restaurantID = restaurant._id;

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

  // Favorite button shows if it's favorite or not
  const favoriteButtonHtml = `
  <button class="btn-favorite" data-restaurant-id="${restaurantID}">
  ${isFavorite ? '⭐ Current Favourite' : '☆ Set as Favourite'}</button>`;

  return `
      <div class="modal-content">
            <h1>${name}</h1>
            <p><strong>Address: </strong>${address}</p>
            <p><strong>Postal Code: </strong>${postalCode}</p>
            <p><strong>City: </strong>${city}</p>
            <p><strong>Phone: </strong>${phone}</p>
            <p><strong>Company: </strong>${company}</p>

            ${favoriteButtonHtml}

            <div class="menu-section">
            <h4>Today's Menu</h4>
              ${menuHtml || '<p>Menu not available</p>'}
            </div>
            <button onclick="this.closest('dialog').close()">Close</button>
            </div>`;
};

const restaurantModalWeekly = (restaurant, weeklyMenu, isFavorite = false) => {
  const {name, address, postalCode, city, phone, company} = restaurant;

  const restaurantID = restaurant._id;
  let menuHtml = '';

  if (weeklyMenu && weeklyMenu.days && weeklyMenu.days.length > 0) {
    weeklyMenu.days.forEach((day) => {
      console.log('Raw date from API:', day.date);
      // Format date
      const date_fi = day.date;

      menuHtml += `<div class="day-menu">
      <h5>${date_fi}</h5>`;

      if (day.courses && day.courses.length > 0) {
        day.courses.forEach((course) => {
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
      } else {
        menuHtml += '<p class="no-menu">No menu available</p>';
      }

      menuHtml += '</div>';
    });
  } else {
    menuHtml = '<p>Weekly menu not available</p>';
  }
  // Favorite button shows if it's favorite or not
  const favoriteButtonHtml = `
  <button class="btn-favorite" data-restaurant-id="${restaurantID}">
  ${isFavorite ? '⭐ Current Favourite' : '☆ Set as Favourite'}</button>`;

  return `
      <div class="modal-content">
            <h1>${name}</h1>
            <p><strong>Address: </strong>${address}</p>
            <p><strong>Postal Code: </strong>${postalCode}</p>
            <p><strong>City: </strong>${city}</p>
            <p><strong>Phone: </strong>${phone}</p>
            <p><strong>Company: </strong>${company}</p>

            ${favoriteButtonHtml}

            <div class="menu-section">
            <h4>Weekly Menu</h4>
              ${menuHtml}
            </div>

            <button onclick="this.closest('dialog').close()">Close</button>
            </div>`;
};

export {restaurantRow, restaurantModal, restaurantModalWeekly};
