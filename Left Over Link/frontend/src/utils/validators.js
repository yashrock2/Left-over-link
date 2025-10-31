export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  // Simple check for E.164 format (e.g., +12223334444)
  const re = /^\+[1-9]\d{1,14}$/;
  return re.test(String(phone));
};