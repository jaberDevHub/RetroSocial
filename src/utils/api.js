import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

API.interceptors.request.use((req) => {
  // No token needed for this simple backend, as authentication is handled by Firebase
  // If you add authentication to this backend, you would add token here.
  return req;
});

export default API;
