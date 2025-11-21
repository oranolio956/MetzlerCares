import { logger } from '../utils/logger.js'

// Custom error classes
export class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.statusCode = 400
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
    this.statusCode = 403
  }
}

export class NotFoundError extends Error {
  constructor(resource = 'Resource') {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message)
    this.name = 'ConflictError'
    this.statusCode = 409
  }
}

export class RateLimitError extends Error {
  constructor(message = 'Too many requests') {
    super(message)
    this.name = 'RateLimitError'
    this.statusCode = 429
  }
}

// Error response formatter
const formatErrorResponse = (error, includeStack = false) => {
  const response = {
    success: false,
    error: {
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString()
    }
  }

  // Add field information for validation errors
  if (error.field) {
    response.error.field = error.field
  }

  // Add stack trace in development or for server errors
  if (includeStack && error.stack) {
    response.error.stack = error.stack
  }

  return response
}

// Main error handler middleware
export const errorHandler = (error, req, res, next) => {
  // Log the error with context
  logger.errorWithContext(error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params
  })

  // Default error properties
  let statusCode = error.statusCode || error.status || 500
  let message = error.message || 'Internal server error'

  // Handle specific error types
  switch (error.name) {
    case 'ValidationError':
      statusCode = 400
      break
    case 'AuthenticationError':
      statusCode = 401
      break
    case 'AuthorizationError':
      statusCode = 403
      break
    case 'NotFoundError':
      statusCode = 404
      break
    case 'ConflictError':
      statusCode = 409
      break
    case 'RateLimitError':
      statusCode = 429
      res.set('Retry-After', '60')
      break
    case 'CastError':
      // Mongoose cast error
      statusCode = 400
      message = 'Invalid data format'
      break
    case 'ValidationError':
      // Mongoose validation error
      statusCode = 400
      message = Object.values(error.errors)
        .map(err => err.message)
        .join(', ')
      break
    default:
      // Handle other specific errors
      if (error.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 409
        message = 'Duplicate entry'
      }
      break
  }

  // In production, don't leak internal error details
  const includeStack = process.env.NODE_ENV === 'development' || statusCode >= 500

  const errorResponse = formatErrorResponse({ ...error, message, statusCode }, includeStack)

  res.status(statusCode).json(errorResponse)
}

// Async error wrapper
export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Error boundary for async operations
export const withErrorHandling = fn => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.errorWithContext(error)
      throw error
    }
  }
}

// Validation error creator
export const createValidationError = (message, field) => {
  return new ValidationError(message, field)
}

// Database error handler
export const handleDatabaseError = error => {
  logger.error('Database error:', error)

  if (error.name === 'MongoNetworkError') {
    throw new Error('Database connection failed')
  }

  if (error.name === 'MongoTimeoutError') {
    throw new Error('Database operation timed out')
  }

  throw error
}

// API error response helper
export const sendErrorResponse = (res, error, statusCode = 500) => {
  const errorResponse = formatErrorResponse(error, process.env.NODE_ENV === 'development')
  res.status(statusCode).json(errorResponse)
}
