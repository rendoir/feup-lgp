export function getApiUrl(): string {
  let url = `${location.protocol}//${location.hostname}`;
  url +=
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? `:${process.env.REACT_APP_API_PORT}`
      : "/api";
  return url;
}
