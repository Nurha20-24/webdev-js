import {restaurantRow, restaurantModal} from './components.js';
import {baseUrl} from './variables.js';
import {fetchData} from './utils.js';
import {
  isLoggedIn,
  login,
  register,
  logout,
  getCurrentUser,
  checkUsernameAvailability,
} from './auth.js';

fetchData(baseUrl);

let allRestaurants = [];
let currentFilter = 'all';
let currentUser = null;

// Auth UI functions
// Update UI based on login state
const updateAuthUI = (user) => {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const welcomeMessage = document.getElementById('welcome-message');

  if (user) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    welcomeMessage.textContent = `Welcome, ${user.username}!`;
    currentUser = user;
  } else {
    loginBtn.style.display = 'block';
    userInfo.style.display = 'none';
    welcomeMessage.textContent = '';
    currentUser = null;
  }
};

// Check if user is already logged in on page load
const checkLoginStatus = async () => {
  if (isLoggedIn()) {
    const user = await getCurrentUser();
    if (user) {
      updateAuthUI(user);
    } else {
      logout();
      updateAuthUI(null);
    }
  }
};

//Auth dialog handlers

// Setup auth dialog functionality
const setupAuthDialog = () => {
  const authDialog = document.getElementById('auth-dialog');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const closeAuthBtn = document.getElementById('close-auth-dialog');
  const closeRegisterBtn = document.getElementById('close-register-dialog');

  // Tab switching
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update active tab
      authTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Show correct form
      if (tabName == 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
      } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
      }

      // Clear previous error messages
      document.getElementById('login-error').textContent = '';
      document.getElementById('register-error').textContent = '';
    });
  });

  // Open login dialog
  loginBtn.addEventListener('click', () => {
    // Reset to login tab
    authTabs[0].click();
    loginForm.reset();
    registerForm.reset();
    authDialog.showModal();
    console.log('Login dialog opened');
  });

  //Close dialog buttons
  closeAuthBtn.addEventListener('click', () => authDialog.close());
  closeRegisterBtn.addEventListener('click', () => authDialog.close());

  // Logout
  logoutBtn.addEventListener('click', () => {
    logout();
    updateAuthUI(null);
    alert('Logged out successfully');
  });

  // username availibility check as user types
  const registerUsername = document.getElementById('register-username');
  const usernameFeedback = document.querySelector('.username-feedback');
  let usernameTimeout;

  registerUsername.addEventListener('input', async () => {
    const username = registerUsername.value.trim();

    // clear previous timeout
    clearTimeout(usernameTimeout);

    if (username.length < 3) {
      usernameFeedback.textContent = '';
      usernameFeedback.className = 'username-feedback';
      return;
    }

    // show checking message
    usernameFeedback.textContent = 'Checking...';
    usernameFeedback.className = 'username-feedback checking';

    // check after stops typing (500ms delay)
    usernameTimeout = setTimeout(async () => {
      const available = await checkUsernameAvailability(username);

      if (available) {
        usernameFeedback.textContent = '✓ Username available';
        usernameFeedback.className = 'username-feedback available';
      } else {
        usernameFeedback.textContent = '✗ Username already taken';
        usernameFeedback.className = 'username-feedback taken';
      }
    }, 500);
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.textContent = '';

    // login
    const result = await login(username, password);

    if (result.success) {
      updateAuthUI(result.user);
      authDialog.close();
      loginForm.reset();
      alert('Login successful!');
    } else {
      errorDiv.textContent =
        result.message || 'Login failed. Please try again.';
    }
  });

  // Handle register for submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById(
      'register-confirm-password'
    ).value;
    const errorDiv = document.getElementById('register-error');

    errorDiv.textContent = '';

    // Validate password match
    if (password !== confirmPassword) {
      errorDiv.textContent = 'Passwords do not match!';
      return;
    }

    // Validate username length
    if (username.length < 3) {
      errorDiv.textContent = 'Username must be at least 3 characters long!';
      return;
    }

    // Register
    const result = await register(username, password, email);

    if (result.success) {
      alert('registration successful! Please login.');

      // Swith login tab
      authTabs[0].click();
      registerForm.reset();
      usernameFeedback.textContent = '';
      usernameFeedback.className = 'username-feedback';
    } else {
      errorDiv.textContent =
        result.message || 'Registration failed. Please try again.';
    }
  });
};

const filterRestaurants = (restaurants, company) => {
  if (company === 'all') {
    return restaurants;
  }
  return restaurants.filter((restaurant) => restaurant.company === company);
};

const updateRestaurantDisplay = (filteredRestaurants) => {
  try {
    if (!filteredRestaurants || filteredRestaurants.length === 0) {
      results.innerHTML = `
    <tr>
      <td colspan ="4" style="text-align: center; color: red;">
     No ${currentFilter === 'all' ? '' : currentFilter + ' '}</td>
    </tr>`;
      return;
    }

    results.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Company</th>
        <th>Address</th>
        <th>Distance</th>
      </tr>`;

    renderUI(filteredRestaurants);
    renderMap(filteredRestaurants);
  } catch (error) {
    console.error('Error updating display: ', error);
    results.innerHTML = `
    <tr>
      <td colspan ="4" style="text-align: center; color: red;">
      Error loading restaurants</td>
    </tr>`;
  }
};

const setupFilters = () => {
  const allbtn = document.getElementById('all-btn');
  const sodexoBtn = document.getElementById('sodexo-btn');
  const compassBtn = document.getElementById('compass-btn');

  allbtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons('all');
    updateRestaurantDisplay(allRestaurants);
  });

  sodexoBtn.addEventListener('click', () => {
    currentFilter = 'Sodexo';
    updateFilterButtons('sodexo');
    const sodexoRestaurants = filterRestaurants(allRestaurants, 'Sodexo');
    updateRestaurantDisplay(sodexoRestaurants);
  });

  compassBtn.addEventListener('click', () => {
    currentFilter = 'Compass Group';
    updateFilterButtons('compass');
    const compassRestaurants = filterRestaurants(
      allRestaurants,
      'Compass Group'
    );
    updateRestaurantDisplay(compassRestaurants);
  });
};

const updateFilterButtons = (activeFilter) => {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  document.getElementById(`${activeFilter}-btn`).classList.add('active');
};

const loadRestaurantDataWithLocation = async (userLat, userLon) => {
  try {
    const data = await fetchData(baseUrl);
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

let map = null;
// render map with leaflet.js library and add restaurant markers
const renderMap = (restaurantArray) => {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([helsinkiLat, helsinkiLon], 13);
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
    const tr = restaurantRow(e);
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

      const dialogContent = restaurantModal(e, menuData);

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

  allRestaurants = restaurantWithDistance;

  const alphabeticalRestaurant = sortRestaurantAlphabetically(
    restaurantWithDistance
  );

  renderUI(alphabeticalRestaurant);
  renderMap(alphabeticalRestaurant);

  setupFilters();
};

// Alphabetical sorting function
const sortRestaurantAlphabetically = (array) => {
  return array.sort((a, b) => a.name.localeCompare(b.name));
};

// Get user's current location using browser geolocation API
const getLocation = () => {
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
    // Fetch restaurant data first, then proceed
    fetchData(baseUrl).then((restaurantData) => {
      proceedWithLocation(helsinkiLat, helsinkiLon, restaurantData);
    });
    //proceedWithLocation(helsinkiLat, helsinkiLon); //Use Helsinki center coordinates as fallback
  }
};
setupAuthDialog();
checkLoginStatus();
getLocation();
