const restaurantsURL =
  'https://media2.edu.metropolia.fi/restaurant//api/v1/restaurants';

const fetchRestaurants = async () => {
  try {
    const response = await fetch(restaurantsURL);
    const data = await response.json();

    console.log('API response: ', data);
    return data;
  } catch (error) {
    console.log('Error fetching restaurant data: ', error);
  }
};
fetchRestaurants();

const loadRestaurantDataWithLocation = async (userLat, userLon) => {
  try {
    const data = await fetchRestaurants();
    proceedWithLocation(userLat, userLon, data);
  } catch (error) {
    console.log('Failed to load restaurants: ', error);
  }
};

const fetchMenu = async (restaurantID, language = 'fi') => {
  const menuURL = `https://media2.edu.metropolia.fi/restaurant//api/v1/restaurants/daily/${restaurantID}/${language}`;
  try {
    const response = await fetch(menuURL);

    const data = await response.json();
    console.log('Menu data: ', data);
    return data;
  } catch (error) {
    console.log('Error fetching menu: ', error);
  }
};
fetchMenu('6470d38ecb12107db6fe24c2', 'fi');

const yourLocation = document.getElementById('your-location');
const results = document.querySelector('table');

// Calculate Euclidean distance between two geographic coordinates, return in kilometers
const calculateDistance = (lon1, lat1, lon2, lat2) => {
  return Math.sqrt((lon2 - lon1) ** 2 + (lat2 - lat1) ** 2) * 111;
};

const helsinkiLat = 60.1699;
const helsinkiLon = 24.9455;

// render map with leaflet.js library and add restaurant markers
const renderMap = (restaurantArray) => {
  let map = L.map('map').setView([helsinkiLat, helsinkiLon], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  restaurantArray.forEach((restaurant) => {
    const [lon, lat] = restaurant.location.coordinates;
    let marker = L.marker([lat, lon]).addTo(map);

    const popUpContent = `<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`;

    marker.bindPopup(popUpContent);
  });
};

// render restaurant data to the UI table
const renderUI = (array) => {
  array.forEach((e) => {
    let tr = document.createElement('tr');
    let trInner = `
      <td>${e.name}</td><td>${e.address}</td><td>~&nbsp;${e.distance.toFixed(
      1
    )}km</td>
    `;
    tr.innerHTML = trInner;
    results.appendChild(tr);

    // Add click event to highlight selected row
    tr.addEventListener('click', async () => {
      document.querySelectorAll('.highlight').forEach((element) => {
        element.classList.remove('highlight');
      });
      tr.classList.add('highlight');

      const dialog = document.querySelector('dialog');

      const menuData = await fetchMenu(e._id, 'fi');
      console.log('Menu for', e.name, ':', menuData);

      let menuHTML = '';
      if (menuData && menuData.courses) {
        const menuItems = menuData.courses
          .map((course) => {
            const dietsHtml = course.diets
              ? `<div class="diets">${course.diets}</div>`
              : '';

            return `
            <div class="menu-item">
          <strong>${course.name}</strong>

          <div class="price">${course.price}</div>
          ${dietsHtml}
          </div>`;
          })
          .join('');

        menuHTML = `<div class="menu-section">
        <h4>Today's Menu</h4> ${menuItems}</div>`;
      } else {
        menuHTML = '<p>Menu not available</p>';
      }

      const dialogContent = `
      <div class="modal-content">
            <h3>${e.name}</h3>
            <p><strong>Address: </strong>${e.address}</p>
            <p><strong>Postal Code: </strong>${e.postalCode}</p>
            <p><strong>City: </strong>${e.city}</p>
            <p><strong>Phone: </strong>${e.phone}</p>
            <p><strong>Company: </strong>${e.company}</p>
            ${menuHTML}
            <button onclick="this.closest('dialog').close()">Close</button>
            </div>`;

      dialog.innerHTML = dialogContent;
      dialog.showModal();
    });
  });
};

// Process user location and calculate distances to restaurants
const proceedWithLocation = (userLat, userLon, restaurantData) => {
  // Filter restaurant that have location data
  const restaurantWithLocation = restaurantData.filter((r) => r.location);

  // Calculate distance for each restaurant and add distance property
  const restaurantWithDistance = restaurantWithLocation.map((restaurant) => {
    const [lon, lat] = restaurant.location.coordinates;
    let distance = calculateDistance(userLon, userLat, lon, lat);

    return {...restaurant, distance};
  });

  const alphabeticalRestaurant = sortRestaurantAlphabetically(
    restaurantWithDistance
  );

  renderUI(alphabeticalRestaurant);
  renderMap(alphabeticalRestaurant);
};

// Alphabetical sorting function
const sortRestaurantAlphabetically = (array) => {
  return array.sort((a, b) => a.name.localeCompare(b.name));
};

// Get user's current location using browser geolocation API
function getLocation() {
  // Check if geolocation is supported by browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    yourLocation.innerHTML = 'Geolocation is not supported by this browser.';
  }

  // Success callback for geolocation
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    yourLocation.innerHTML = `Your Location: <br> Latitude: ${latitude} <br> Longitude: ${longitude}`;

    loadRestaurantDataWithLocation(latitude, longitude);
  }

  // Error callback for geolocation
  function error() {
    alert(
      'Unable to retrieve your position - default location Helsinki center.'
    );
    proceedWithLocation(helsinkiLat, helsinkiLon); //Use Helsinki center coordinates as fallback
  }
}
getLocation();
