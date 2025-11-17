import { dev } from '$app/environment'
import { logger } from './logger'

export interface AppError extends Error {
  code: string
  statusCode: number
  details?: Record<string, any>
  isOperational: boolean
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR'
  statusCode = 400
  isOperational = true
  
  constructor(message: string, public details?: Record<string, any>) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error implements AppError {
  code = 'AUTHENTICATION_ERROR'
  statusCode = 401
  isOperational = true
  
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error implements AppError {
  code = 'AUTHORIZATION_ERROR'
  statusCode = 403
  isOperational = true
  
  constructor(message: string = 'Access denied') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error implements AppError {
  code = 'NOT_FOUND'
  statusCode = 404
  isOperational = true
  
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends Error implements AppError {
  code = 'RATE_LIMIT_EXCEEDED'
  statusCode = 429
  isOperational = true
  
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class DatabaseError extends Error implements AppError {
  code = 'DATABASE_ERROR'
  statusCode = 500
  isOperational = true
  
  constructor(message: string, public details?: Record<string, any>) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ExternalServiceError extends Error implements AppError {
  code = 'EXTERNAL_SERVICE_ERROR'
  statusCode = 502
  isOperational = true
  
  constructor(message: string, public service?: string, public details?: Record<string, any>) {
    super(message)
    this.name = 'ExternalServiceError'
  }
}

export function isAppError(error: any): error is AppError {
  return error && typeof error === 'object' && 'isOperational' in error
}

export function handleError(error: Error | AppError, context?: string): AppError {
  // If it's already an AppError, return it
  if (isAppError(error)) {
    return error
  }

  // Convert unknown errors to AppError
  const appError = new DatabaseError('An unexpected error occurred')
  
  // Log the original error for debugging
  logger.error('Error handler caught:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  })

  return appError
}

export function sanitizeErrorForClient(error: AppError): AppError {
  // Remove sensitive details in production
  if (!dev && error.details) {
    const sanitized = { ...error }
    delete sanitized.details
    return sanitized
  }
  return error
}

export function createErrorResponse(error: AppError, headers?: Record<string, string>) {
  const sanitizedError = sanitizeErrorForClient(error)
  
  return {
    status: sanitizedError.statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: {
      error: {
        code: sanitizedError.code,
        message: sanitizedError.message,
        ...(sanitizedError.details && { details: sanitizedError.details })
      }
    }
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const appError = handleError(error as Error, context)
    throw appError
  }
}