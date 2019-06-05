// Source: https://medium.com/@romanchvalbo/how-i-set-up-react-and-node-with-json-web-token-for-authentication-259ec1a90352

import decode from 'jwt-decode';
import { getApiURL } from './apiURL';

export default class AuthHelperMethods {
  login = async (email, password) => {
    try {
      // Get a token from api server using the fetch api
      const res = await this.fetch(getApiURL(`/login`), {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        })
      });
      this.setToken(res.token); // Setting the token in localStorage
      return Promise.resolve(res);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };

  isAdmin = () => {
    const user = this.getUserPayload(); // Getting token from localstorage
    return this.loggedIn() && user && user.permission === 'admin';
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.log('expired check failed! Line 42: AuthService.js');
      return false;
    }
  };

  setToken = idToken => {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
  };

  getUserPayload = () => {
    return this.getToken() ? decode(this.getToken()) : null;
  };

  isLoggedInUser = id => {
    const payload = this.getUserPayload();
    return payload && payload.id === id;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  getAuthHeader = () => {
    return 'Bearer ' + this.getToken();
  };

  _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
