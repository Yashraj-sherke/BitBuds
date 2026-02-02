/**
 * Sanitize user input to prevent XSS and other attacks
 * This middleware cleans request body, query, and params
 */
const sanitizeInput = (req, res, next) => {
  // Recursive function to sanitize strings in objects
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove potential XSS patterns
      return obj
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = sanitize(obj[key]);
        return acc;
      }, {});
    }
    
    return obj;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

export default sanitizeInput;
