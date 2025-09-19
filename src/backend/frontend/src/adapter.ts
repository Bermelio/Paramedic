const API_BASE_URL: string = process.env.NODE_ENV === 'production'
  ? 'https://paramedic-rbfh.onrender.com'
  : 'http://localhost:5000';

export { API_BASE_URL };