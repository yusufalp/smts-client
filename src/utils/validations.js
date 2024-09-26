const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const PASSWORD_REGEX =
  /^(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/;

export function validatePassword(value) {
  if (!value.match(PASSWORD_REGEX)) {
    return "Include an uppercase, a lowercase, a number and a special character: '@ # $ % ^ & + ! = ' ";
  } else if (value.length < 8) {
    return "Must be at least 8 characters";
  } else {
    return "";
  }
}

export function validateEmail(value) {
  if (!value.match(EMAIL_REGEX)) {
    return "Enter a valid email";
  } else {
    return "";
  }
}
