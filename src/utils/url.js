export const constructUrl = (baseUrl, endpoint, params = {}, query = {}) => {
  let urlString = `${baseUrl}${endpoint}`;

  for (const key in params) {
    urlString = urlString.replace(`:${key}`, encodeURIComponent(params[key]));
  }

  const url = new URL(urlString);

  for (const key in query) {
    url.searchParams.append(key, query[key]);
  }

  return url.toString();
};

export const retrieveHostname = (link) => {
  const url = new URL(link);

  return url.hostname;
};

export const retrievePathname = (link) => {
  const url = new URL(link);

  return url.pathname;
};

export const formatLinkWithoutProtocol = (link) => {
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
};
