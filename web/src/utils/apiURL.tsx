/**
 * Returns the complete API URL for a given route
 *
 * @param route final portion of the URL, which is different for every route.
 *
 * Route examples:
 * '/post/3'
 * '/users/subscription'
 * '/post/subscription'
 */
export function getApiURL(route: string) {
  let apiURL = `${location.protocol}//${location.hostname}`;
  apiURL +=
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? `:${process.env.REACT_APP_API_PORT}`
      : '/api';
  apiURL += route;

  return apiURL;
}
