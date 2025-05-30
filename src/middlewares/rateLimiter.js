import rateLimit from 'express-rate-limit';

// Limit each IP to 5 requests per minute for project ideas endpoint
export const projectIdeasLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: 'Too many requests from this IP, please try again after a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiter (optional, can be used for all endpoints)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
