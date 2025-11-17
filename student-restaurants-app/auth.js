const authBaseUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

// Get token from local storage
const getToken = () => {
  return localStorage.getItem('token');
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

    const data = await response.json();
    return data.available;
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

// Get current user info using token
const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${authBaseUrl}/users/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid, remove it
      removeToken();
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting current user: ', error);
    removeToken();
    return null;
  }
};

//Logout user
const logout = () => {
  removeToken();
};

// Update user profile
const updateUser = async (updates) => {
  const token = getToken();
  if (!token) {
    return {success: false, message: 'Not logged in'};
  }

  try {
    const response = await fetch(`${authBaseUrl}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }

    return {success: true, user: data.data};
  } catch (error) {
    console.error('Update error:', error);
    return {success: false, message: error.message};
  }
};

// Delete user account
const deleteUser = async () => {
  const token = getToken();
  if (!token) {
    return {success: false, message: 'Not logged in'};
  }

  try {
    const response = await fetch(`${authBaseUrl}/users`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Delete failed');
    }

    // Remove token after successful deletion
    removeToken();
    return {success: true, message: data.message};
  } catch (error) {
    console.error('Delete error:', error);
    return {success: false, message: error.message};
  }
};

export {
  getToken,
  saveToken,
  removeToken,
  isLoggedIn,
  checkUsernameAvailability,
  register,
  login,
  getCurrentUser,
  logout,
  updateUser,
  deleteUser,
};
