import {
  restaurantRow,
  restaurantModal,
  restaurantModalWeekly,
} from './components.js';
import {baseUrl} from './variables.js';
import {fetchData} from './utils.js';
import {
  isLoggedIn,
  login,
  register,
  logout,
  getCurrentUser,
  checkUsernameAvailability,
  updateUser,
  deleteUser,
  uploadAvatar,
} from './auth.js';

fetchData(baseUrl);

let allRestaurants = [];
let currentFilter = 'all';
let currentUser = null;
let currentCityFilter = 'all';
let currentMenuType = 'daily';
let currentSortMode = 'alphabetical';

// City filter functions

// Extracts unique cities from restaurants
const getUniqueCities = (restaurants) => {
  const cities = restaurants
    .map((restaurant) => restaurant.city)
    .filter((city) => city); // Filter out undefined/null cities

  // Get unique cities and sort alphabetically
  return [...new Set(cities)].sort();
};

// Populate city dropdown with wnuique cities
const populateCityFilter = (restaurants) => {
  const cityFilter = document.getElementById('city-filter');
  const cities = getUniqueCities(restaurants);

  // Clear existing options except "All Cities"
  cityFilter.innerHTML = '<option value="all">All Cities</option>';

  cities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
};

// Filter restaurants by both company and city
const filterRestaurantsByCompanyAndCity = (restaurants, company, city) => {
  let filtered = restaurants;

  // Filter by company
  if (company !== 'all') {
    filtered = filtered.filter((restaurant) => restaurant.company === company);
  }

  // Filter by city
  if (city !== 'all') {
    filtered = filtered.filter((restaurant) => restaurant.city === city);
  }
  return filtered;
};

// Setup city filter event listener
const setupCityFilter = () => {
  const cityFilter = document.getElementById('city-filter');

  cityFilter.addEventListener('change', (e) => {
    currentCityFilter = e.target.value;

    const filtered = filterRestaurantsByCompanyAndCity(
      allRestaurants,
      currentFilter,
      currentCityFilter
    );
    updateRestaurantDisplay(filtered);
  });
};

// Favourite restaurant functions

// handle setting favourite restaurant
const handleFavouriteClick = async (restaurantID) => {
  if (!currentUser) {
    alert('Please login to set favourite restaurant.');
    return;
  }

  try {
    // Check if restaurant is already favourite
    const isFavourite = currentUser.favouriteRestaurant === restaurantID;

    // If it's already favourite, don't do anything
    if (isFavourite) {
      alert('This is already you favourite restaurant!');
      return;
    }

    // Set as favourite
    const result = await updateUser({favouriteRestaurant: restaurantID});

    if (result.success) {
      // Update current user data
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        currentUser = updatedUser;

        // Refresh the restaurant display to show new favorite
        const filtered = filterRestaurantsByCompanyAndCity(
          allRestaurants,
          currentFilter,
          currentCityFilter
        );
        updateRestaurantDisplay(filtered);

        // alert('Set as favorite! Your previous favourite has been replaced.');
      }
    } else {
      alert('Failed to update favorite: ' + result.message);
    }
  } catch (error) {
    console.error('Error updating favourite: ', error);
    alert('Failed to update favourite restaurant');
  }
};

const isFavouriteRestaurant = (restaurantId) => {
  if (!currentUser || !currentUser.favouriteRestaurant) {
    return false;
  }
  return currentUser.favouriteRestaurant === restaurantId;
};

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
    displayHeaderAvatar(user);
  } else {
    loginBtn.style.display = 'block';
    userInfo.style.display = 'none';
    welcomeMessage.textContent = '';
    currentUser = null;

    // Hide avatar
    const headerAvatar = document.getElementById('header-avatar');
    headerAvatar.style.display = 'none';
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

  registerUsername.addEventListener('input', () => {
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
      usernameFeedback.className = 'edit-username-feedback';
    } else {
      errorDiv.textContent =
        result.message || 'Registration failed. Please try again.';
    }
  });
};

// Profile dialog handlers
const setupProfileDialog = () => {
  const profileDialog = document.getElementById('profile-dialog');
  const profileBtn = document.getElementById('profile-btn');
  const closeProfileBtn = document.getElementById('close-profile-btn');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const deleteAccountBtn = document.getElementById('delete-account-btn');

  const profileView = document.getElementById('profile-view');
  const profileEdit = document.getElementById('profile-edit');
  const profileForm = document.getElementById('profile-edit-form');

  // Open profile dialog
  profileBtn.addEventListener('click', async () => {
    console.log('Profile button clicked!'); // ADD THIS
    console.log('Current user:', currentUser); // ADD THIS
    if (!currentUser) {
      alert('Please login first');
      return;
    }

    const user = await getCurrentUser();
    console.log('Refreshed user:', user); // ADD THIS
    if (user) {
      currentUser = user;
      displayProfileInfo(user);
      showProfileView();
      profileDialog.showModal();
    }
  });

  // Close profile dialog
  closeProfileBtn.addEventListener('click', () => profileDialog.close());

  // Switch to edit mode
  editProfileBtn.addEventListener('click', () => {
    showProfileEdit();
  });

  // Cancel edit mode
  cancelEditBtn.addEventListener('click', () => {
    showProfileView();
    profileForm.reset();
    document.getElementById('profile-error').textContent = '';
    document.getElementById('profile-success').textContent = '';
  });

  // Username availability check for edit form
  const editUsername = document.getElementById('edit-username');
  const editUsernameFeedback = document.querySelector(
    '.edit-username-feedback'
  );
  let editUsernameTimeout;

  editUsername.addEventListener('input', () => {
    const username = editUsername.value.trim();

    clearTimeout(editUsernameTimeout);

    // If username is unchanged, clear feedback
    if (username === currentUser.username) {
      editUsernameFeedback.textContent = '';
      editUsernameFeedback.className = 'edit-username-feedback';
      return;
    }

    if (username.length < 3) {
      editUsernameFeedback.textContent = '';
      editUsernameFeedback.className = 'username-feedback';
      return;
    }

    editUsernameFeedback.textContent = 'Checking...';
    editUsernameFeedback.className = 'edit-username-feedback checking';

    editUsernameTimeout = setTimeout(async () => {
      const available = await checkUsernameAvailability(username);

      if (available) {
        editUsernameFeedback.textContent = '✓ Username available';
        editUsernameFeedback.className = 'edit-username-feedback available';
      } else {
        editUsernameFeedback.textContent = '✗ Username already taken';
        editUsernameFeedback.className = 'edit-username-feedback taken';
      }
    }, 500);
  });

  // Handle profile update
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const password = document.getElementById('edit-password').value;
    const confirmedPassword = document.getElementById(
      'edit-confirm-password'
    ).value;

    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Validate password match if password provided
    if (password || confirmedPassword) {
      if (password !== confirmedPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        return;
      }
      if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long!';
        return;
      }
    }

    // Build update object (only include changed fields)
    const updates = {};
    if (username !== currentUser.username) updates.username = username;
    if (email !== currentUser.email) updates.email = email;
    if (password) updates.password = password;

    // Check if anyThing changed
    if (Object.keys(updates).length === 0) {
      errorDiv.textContent = 'No changes to save.';
      return;
    }

    // Update profile
    const result = await updateUser(updates);

    if (result.success) {
      successDiv.textContent = 'Profile updated succcessfully!';

      // Refresh current user data
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        currentUser = updatedUser;
        updateAuthUI(updatedUser);
        displayProfileInfo(updatedUser);
      }

      // Switch back to view mode after short delay
      setTimeout(() => {
        showProfileView();
        successDiv.textContent = '';
      }, 2000);
    } else {
      errorDiv.textContent =
        result.message || 'Update failed. Please try again.';
    }
  });

  // Handle account deletion
  deleteAccountBtn.addEventListener('click', async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone!'
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
      'This is your last chance to cancel. Are you absolutely sure? '
    );

    if (!doubleConfirm) return;

    const result = await deleteUser();
    if (result.success) {
      alert('Account deleted successfully.');
      profileDialog.close();
      updateAuthUI(null);
      currentUser = null;
    } else {
      alert('Failed to delete account: ' + result.message);
    }
  });

  // Avatar upload handling
  const uploadAvatarbtn = document.getElementById('upload-avatar-btn');
  const avatarInput = document.getElementById('avatar-input');

  // Click upload button to trigger file input
  uploadAvatarbtn.addEventListener('click', () => {
    avatarInput.click();
  });

  avatarInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show uploading state
    uploadAvatarbtn.textContent = 'Uploading...';
    uploadAvatarbtn.disabled = true;

    // Upload avatar
    const result = await uploadAvatar(file);

    uploadAvatarbtn.textContent = 'Upload new Avatar';
    uploadAvatarbtn.disabled = false;

    if (result.success) {
      alert('Avatar uploaded successfully!');

      // refresh user data to get updated avatar
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        currentUser = updatedUser;
        updateAuthUI(updatedUser);
        displayProfileAvatar(updatedUser);
      }
    } else {
      alert('Failed to upload avatar: ' + result.message);
    }

    // Clear file input
    avatarInput.value = '';
  });

  function displayProfileInfo(user) {
    document.getElementById('profile-username-display').textContent =
      user.username;
    document.getElementById('profile-email-display').textContent = user.email;

    displayProfileAvatar(user);

    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-password').value = '';
    document.getElementById('edit-confirm-password').value = '';
  }

  function showProfileView() {
    profileView.style.display = 'block';
    profileEdit.style.display = 'none';
  }

  function showProfileEdit() {
    profileView.style.display = 'none';
    profileEdit.style.display = 'block';
  }
};

//  Get avatar URL from filename
const getAvatarUrl = (avatarFilename) => {
  if (!avatarFilename) return null;
  return `https://media2.edu.metropolia.fi/restaurant/uploads/${avatarFilename}`;
};

// Display avatar in header
const displayHeaderAvatar = (user) => {
  const headerAvatar = document.getElementById('header-avatar');

  if (user && user.avatar) {
    headerAvatar.src = getAvatarUrl(user.avatar);
    headerAvatar.style.display = 'inline-block';
  } else {
    headerAvatar.style.display = 'none';
  }
};

// Display avatar in profile dialog
const displayProfileAvatar = (user) => {
  const profileAvatarImg = document.getElementById('profile-avatar-img');

  if (user && user.avatar) {
    profileAvatarImg.src = getAvatarUrl(user.avatar);
    profileAvatarImg.style.display = 'block';
  } else {
    const firstLetter = user ? user.username.charAt(0).toUpperCase() : '?';

    // Placeholder profile picture with first letter
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // Backgroud radient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, '#c1cdccff');
    gradient.addColorStop(1, '#89a09fff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Letter
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

    // Set as image source
    profileAvatarImg.src = canvas.toDataURL();
    profileAvatarImg.alt = `${user.username}' placeholder avatar`;
    profileAvatarImg.style.display = 'block';
  }
};

const updateRestaurantDisplay = (filteredRestaurants) => {
  try {
    const countDisplay = document.getElementById('restaurant-count');

    if (!filteredRestaurants || filteredRestaurants.length === 0) {
      countDisplay.textContent = 'No restaurants found';
      results.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; color: red;">
     No ${
       currentFilter === 'all' ? '' : currentFilter + ' '
     }restaurants found</td>
    </tr>`;
      return;
    }

    const count = filteredRestaurants.length;
    countDisplay.textContent = `Showing ${count} restaurant${
      count !== 1 ? 's' : ''
    }`;

    results.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Company</th>
        <th>Address</th>
        <th>Distance</th>
      </tr>`;

    const sortedRestaurants = sortRestaurants(filteredRestaurants);

    renderUI(sortedRestaurants);
    renderMap(sortedRestaurants);
  } catch (error) {
    console.error('Error updating display: ', error);
    const countDisplay = document.getElementById('restaurant-count');
    countDisplay.textContent = 'Error loading restaurants';
    results.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; color: red;">
      Error loading restaurants</td>
    </tr>`;
  }
};

// Sort restaurants alphabetically or by distance

// Sort resaturants by distance
const sortRestaurantsByDistance = (array) => {
  return array.sort((a, b) => {
    const distanceA = a.distance || Infinity;
    const distanceB = b.distance || Infinity;
    return distanceA - distanceB;
  });
};

// Sort restaurants based on current mode
const sortRestaurants = (array) => {
  if (currentSortMode === 'distance') {
    return sortRestaurantsByDistance(array);
  } else {
    return sortRestaurantAlphabetically(array);
  }
};

// Setup sort button
const setupSortButton = () => {
  const sortBtn = document.getElementById('sort-btn');

  sortBtn.addEventListener('click', () => {
    // Toggle sort mode
    if (currentSortMode === 'alphabetical') {
      currentSortMode = 'distance';
      sortBtn.textContent = 'Sort: Distance';
      sortBtn.dataset.sort = 'distance';
    } else {
      currentSortMode = 'alphabetical';
      sortBtn.textContent = 'Sort: Alphabetical';
      sortBtn.dataset.sort = 'alphabetical';
    }

    // Reapply current filters with new sort
    const filtered = filterRestaurantsByCompanyAndCity(
      allRestaurants,
      currentFilter,
      currentCityFilter
    );
    updateRestaurantDisplay(filtered);
  });
};

const setupFilters = () => {
  const allbtn = document.getElementById('all-btn');
  const sodexoBtn = document.getElementById('sodexo-btn');
  const compassBtn = document.getElementById('compass-btn');

  allbtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons('all');

    // Apply both company and city filters
    const filtered = filterRestaurantsByCompanyAndCity(
      allRestaurants,
      'all',
      currentCityFilter
    );

    updateRestaurantDisplay(filtered);
    console.log('Calling updateRestaurantDisplay for the first time');
  });

  sodexoBtn.addEventListener('click', () => {
    currentFilter = 'Sodexo';
    updateFilterButtons('sodexo');

    const filtered = filterRestaurantsByCompanyAndCity(
      allRestaurants,
      'Sodexo',
      currentCityFilter
    );
    updateRestaurantDisplay(filtered);
  });

  compassBtn.addEventListener('click', () => {
    currentFilter = 'Compass Group';
    updateFilterButtons('compass');

    const filtered = filterRestaurantsByCompanyAndCity(
      allRestaurants,
      'Compass Group',
      currentCityFilter
    );
    updateRestaurantDisplay(filtered);
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

// fetch daily menu from API
const fetchMenu = async (restaurantID, language = 'fi') => {
  const menuURL = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${restaurantID}/${language}`;
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

// fetch weekly menu from API
const fetchWeeklyMenu = async (restaurantID, language = 'fi') => {
  const menuURL = `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly/${restaurantID}/${language}`;

  try {
    const response = await fetch(menuURL);
    const data = await response.json();
    console.log('Weekly menu data: ', data);
    return data;
  } catch (error) {
    console.log('Error fetching weekly menu: ', error);
    return null;
  }
};

// Setup menu type selector (Daily/Weekly buttons)
const setupMenuTypeSelector = () => {
  const dailyMenuBtn = document.getElementById('daily-menu-btn');
  const weeklyMenuBtn = document.getElementById('weekly-menu-btn');

  dailyMenuBtn.addEventListener('click', () => {
    currentMenuType = 'daily';

    // Update button styles
    dailyMenuBtn.classList.add('active');
    weeklyMenuBtn.classList.remove('active');

    // Refresh modal if a restaurant is open
  });

  weeklyMenuBtn.addEventListener('click', () => {
    currentMenuType = 'weekly';

    // Update button styles
    weeklyMenuBtn.classList.add('active');
    dailyMenuBtn.classList.remove('active');
  });
};

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

// Find closest restautrant from an array
const findClosestRestaurant = (restaurants) => {
  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  // Find restaurant with minimum distance
  let closest = restaurants[0];

  restaurants.forEach((restaurant) => {
    if (restaurant.distance && restaurant.distance < closest.distance) {
      closest = restaurant;
    }
  });

  return closest._id;
};

// render restaurant data to the UI table
const renderUI = (array) => {
  // Find closest restaurant ID
  const closestRestaurantId = findClosestRestaurant(array);

  array.forEach((e) => {
    // Check if this restaurant is the favourite
    const isFavourite = isFavouriteRestaurant(e._id);

    // Check if this restaurant is the closest
    const isClosest = e._id === closestRestaurantId;

    // Create restaurant row with favourite status
    const tr = restaurantRow(e, isFavourite, isClosest);
    results.appendChild(tr);

    // Add click event to highlight selected row and show modal
    tr.addEventListener('click', async () => {
      document.querySelectorAll('.highlight').forEach((element) => {
        element.classList.remove('highlight');
      });

      tr.classList.add('highlight');

      const dialog = document.querySelector('dialog');

      let dialogContent;

      // Fetch correct menu based on selection
      if (currentMenuType === 'weekly') {
        const weeklyMenuData = await fetchWeeklyMenu(e._id, 'fi');
        console.log('Weekly Menu for', e.name, ':', weeklyMenuData);
        dialogContent = restaurantModalWeekly(e, weeklyMenuData, isFavourite);
      } else {
        const menuData = await fetchMenu(e._id, 'fi');
        console.log('Menu for', e.name, ':', menuData);
        dialogContent = restaurantModal(e, menuData, isFavourite);
      }

      dialog.innerHTML = dialogContent;
      dialog.showModal();

      // Add event listener to favourite button in modal
      const favoriteBtn = dialog.querySelector('.btn-favorite');
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', async () => {
          await handleFavouriteClick(e._id);
          dialog.close();
        });
      }
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

  populateCityFilter(allRestaurants);
  setupCityFilter();
  setupSortButton();
  setupFilters();
  updateRestaurantDisplay(alphabeticalRestaurant);
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

    yourLocation.innerHTML = `Your Location: <br> Latitude: ${latitude.toFixed(
      4
    )} <br> Longitude: ${longitude.toFixed(4)}`;

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
setupProfileDialog();
setupMenuTypeSelector();
getLocation();
