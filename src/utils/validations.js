const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const PASSWORD_REGEX =
  /^(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/;

export function validatePassword(value) {
  if (value === "") {
    return "Password cannot be blank";
  } else if (value.length < 8) {
    return "Password must be at least 8 characters";
  } else if (!value.match(PASSWORD_REGEX)) {
    return "Password must include an uppercase, a lowercase, a number and a special character: @ # $ % ^ & + ! =";
  } else {
    return "";
  }
}

export function validateEmail(value) {
  if (value === "") {
    return "Email cannot be blank";
  } else if (!value.match(EMAIL_REGEX)) {
    return "Enter a valid email";
  } else {
    return "";
  }
}
