// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error messages
export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  ACCOUNT_DISABLED: 'Your account has been disabled',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_REQUIRED: 'Authentication token is required',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  
  // Validation
  VALIDATION_ERROR: 'Validation error',
  INVALID_INPUT: 'Invalid input data',
  MISSING_FIELDS: 'Required fields are missing',
  
  // General
  INTERNAL_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  FORBIDDEN: 'You do not have permission to perform this action',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  
  // Database
  DATABASE_ERROR: 'Database operation failed',
  DUPLICATE_ENTRY: 'Duplicate entry found',
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

// Token types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]+$/,
};

export default {
  USER_ROLES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  CACHE_TTL,
  TOKEN_TYPES,
  REGEX_PATTERNS,
};
