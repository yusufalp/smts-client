export const constructUrl = (baseUrl, endpoint, params = {}, query = {}) => {
  let urlString = `${baseUrl}${endpoint}`;

  for (const key in params) {
    urlString = urlString.replace(`:${key}`, encodeURIComponent(params[key]));
  }

  const url = new URL(urlString);

  for (const key in query) {
    url.searchParams.append(key, query[key]);
  }

  console.log("url :>> ", url.toString());

  return url.toString(); // Return the string representation
};
