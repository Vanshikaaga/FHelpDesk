import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    try {
      // Ensure URL parsing is reliable
      const requestUrl = new URL(config.url, window.location.origin);
      const pathname = requestUrl.pathname;

      // Detect static asset requests (skip attaching token)
      const isStaticRequest =
        pathname === '/manifest.json' ||
        pathname.includes('favicon') ||
        pathname.includes('logo') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.webmanifest');

      if (!isStaticRequest) {
        const userJson = localStorage.getItem('fb_helpdesk_user');
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
      }
    } catch (err) {
      console.warn('Interceptor URL parsing error:', err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest._retry
    ) {
      localStorage.removeItem('fb_helpdesk_user');
      window.location.href = '/login';
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';

    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default instance;
