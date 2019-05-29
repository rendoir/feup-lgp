import axios from 'axios';
import promise from 'promise';
import { getApiURL } from './apiURL';
import AuthHelperMethods from './AuthHelperMethods';

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: getApiURL('')
});
const auth = new AuthHelperMethods();

axiosInstance.interceptors.request.use(
  config => {
    // if token is found add it to the header
    if (auth.loggedIn()) {
      if (config.method !== 'OPTIONS') {
        config.headers.authorization = auth.getAuthHeader();
      }
    }
    return config;
  },
  error => {
    // Do something with request error
    return promise.reject(error);
  }
);

export default axiosInstance;
