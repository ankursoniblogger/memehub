const BASE_URL = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

// Example for a protected route (get user profile or memes)
export const getUserData = async () => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return res.json();
};
