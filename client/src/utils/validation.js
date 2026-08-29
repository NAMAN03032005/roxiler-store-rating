/**
 * Form validation helper functions adhering strictly to Roxiler specifications.
 */

export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 20) {
    return 'Name must be at least 20 characters long.';
  }
  if (trimmed.length > 60) {
    return 'Name cannot exceed 60 characters.';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return '';
};

export const validateAddress = (address) => {
  if (!address || address.trim() === '') {
    return 'Address is required.';
  }
  if (address.trim().length > 400) {
    return 'Address cannot exceed 400 characters.';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (password.length > 16) {
    return 'Password cannot exceed 16 characters.';
  }
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter.';
  }
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!hasSpecial) {
    return 'Password must contain at least one special character.';
  }
  return '';
};

export const validateStoreName = (storeName) => {
  if (!storeName || storeName.trim() === '') {
    return 'Store name is required.';
  }
  if (storeName.trim().length > 100) {
    return 'Store name cannot exceed 100 characters.';
  }
  return '';
};
