import { LENGTH, REGEX } from "../constants/validations";

export function validatePassword(value) {
  if (value === "") {
    return "Password cannot be blank";
  } else if (value.length < LENGTH.PASSWORD_MIN) {
    return `Password must be at least ${LENGTH.PASSWORD_MIN} characters`;
  } else if (!value.match(REGEX.PASSWORD)) {
    return "Password must include an uppercase, a lowercase, a number and a special character: @ # $ % ^ & + ! =";
  }

  return "";
}

export function validateEmail(value) {
  if (value === "") {
    return "Email cannot be blank";
  } else if (!value.match(REGEX.EMAIL)) {
    return "Email is not valid";
  }

  return "";
}

export function validatePhoneNumber(value) {
  if (!value.match(REGEX.PHONE_NUMBER)) {
    return "Enter ten digits, numbers only, including area code";
  }

  return "";
}

export function validateLinkedinUrl(value) {
  if (value !== "" && !value.match(REGEX.LINKEDIN)) {
    return "Enter a valid LinkedIn profile url";
  }

  return "";
}

export function validateGithubUrl(value) {
  if (value !== "" && !value.match(REGEX.GITHUB)) {
    return "Enter a valid GitHub profile url";
  }

  return "";
}
