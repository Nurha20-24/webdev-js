const authBaseUrl = 'https://media2.edu.metropolia.fi/restaurant//api/v1';

// Get token from local storage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Save token to local storage
const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from local storage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
const isLoggedIn = () => {
  return getToken() !== null;
};

// Check username availability (as user types)
const checkUsernameAvailability = async (username) => {
  try {
    const response = await fetch(`${authBaseUrl}/users/available/${username}`);
  } catch (error) {
    console.error('Error checking username: ', error);
    return false;
  }
};

// Register new user
const register = async (username, password, email) => {
  try {
    const response = await fetch(`${authBaseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password, email}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return {success: true, data};
  } catch (error) {
    console.error('Registration error: ', error);
    return {success: false, message: error.message};
  }
};

// Login user
const login = async (username, password) => {
  try {
    const response = await fetch(`${authBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    saveToken(data.token);
    return {success: true, user: data.data, token: data.token};
  } catch (error) {
    console.error('Login error: ', error);
    return {success: false, message: error.message};
  }
};
