import Axios from 'axios';

const TOKEN_KEY = 'GW1c3sKlPkAJ4oDYkExOQf8t8NPU3mQM';

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function initAxiosInterceptors() {
  Axios.interceptors.request.use(function (config) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  Axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        deleteToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}
