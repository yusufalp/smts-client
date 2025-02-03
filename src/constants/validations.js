export const LENGTH = {
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 32,
};

export const REGEX = {
  EMAIL: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
  PASSWORD:
    /^(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/,
  PHONE_NUMBER: /^[0-9]{10}/,
  LINKEDIN:
    /^(https?:\/\/)?(www\.)?([a-z]{2,3}\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\/?$/,
  GITHUB:
    /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}\/?$/,
};
