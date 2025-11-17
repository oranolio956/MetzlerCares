import { error } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { securityLogger } from './logger'

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Security errors
  CSRF_VALIDATION_FAILED = 'CSRF_VALIDATION_FAILED',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  
  // File upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

export interface AppError extends Error {
  code: ErrorCode
  status: number
  details?: Record<string, any>
  requestId?: string
  userMessage?: string
}

export class MetzlerCaresError extends Error implements AppError {
  code: ErrorCode
  status: number
  details?: Record<string, any>
  requestId?: string
  userMessage?: string

  constructor(
    code: ErrorCode,
    message: string,
    status = 500,
    details?: Record<string, any>,
    userMessage?: string
  ) {
    super(message)
    this.name = 'MetzlerCaresError'
    this.code = code
    this.status = status
    this.details = details
    this.userMessage = userMessage || this.getDefaultUserMessage(code)
  }

  private getDefaultUserMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.UNAUTHORIZED]: 'Please log in to continue',
      [ErrorCode.FORBIDDEN]: 'You don\'t have permission to access this resource',
      [ErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password',
      [ErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please log in again',
      [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again',
      [ErrorCode.INVALID_INPUT]: 'Invalid input provided',
      [ErrorCode.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields',
      [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
      [ErrorCode.CSRF_VALIDATION_FAILED]: 'Security validation failed. Please try again',
      [ErrorCode.SECURITY_VIOLATION]: 'Security violation detected',
      [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds the maximum allowed size',
      [ErrorCode.INVALID_FILE_TYPE]: 'File type is not allowed',
      [ErrorCode.UPLOAD_FAILED]: 'File upload failed. Please try again',
      [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again',
      [ErrorCode.NOT_FOUND]: 'The requested resource was not found',
      [ErrorCode.CONFLICT]: 'A conflict occurred. Please try again',
      [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service error occurred',
      [ErrorCode.PAYMENT_ERROR]: 'Payment processing failed. Please try again',
      [ErrorCode.INTERNAL_ERROR]: 'An internal error occurred. Please try again',
      [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable'
    }

    return messages[code] || 'An unexpected error occurred. Please try again'
  }
}

export function createError(
  code: ErrorCode,
  message: string,
  status = 500,
  details?: Record<string, any>,
  userMessage?: string
): AppError {
  return new MetzlerCaresError(code, message, status, details, userMessage)
}

export async function handleError(
  err: unknown,
  event: RequestEvent,
  context?: string
): Promise<AppError> {
  const requestId = event.locals.requestId || crypto.randomUUID()
  
  let appError: AppError
  
  if (err instanceof MetzlerCaresError) {
    appError = err
  } else if (err instanceof Error) {
    appError = createError(
      ErrorCode.INTERNAL_ERROR,
      err.message,
      500,
      { stack: err.stack, name: err.name },
      'An internal error occurred'
    )
  } else {
    appError = createError(
      ErrorCode.INTERNAL_ERROR,
      String(err),
      500,
      {},
      'An internal error occurred'
    )
  }
  
  appError.requestId = requestId
  
  // Log the error
  securityLogger.error('Application error', {
    error: appError,
    context: context || 'request_handler',
    ipAddress: event.getClientAddress(),
    userAgent: event.request.headers.get('user-agent') || undefined,
    requestId,
    userId: event.locals.user?.id
  })
  
  return appError
}

export function errorResponse(appError: AppError) {
  return error(appError.status, new Error(appError.userMessage || 'An error occurred'))
}

// Validation helpers
export function validateRequiredField(
  value: unknown,
  fieldName: string
): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) {
    throw createError(
      ErrorCode.MISSING_REQUIRED_FIELD,
      `Missing required field: ${fieldName}`,
      400,
      { field: fieldName }
    )
  }
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError(
      ErrorCode.INVALID_INPUT,
      'Invalid email format',
      400,
      { field: 'email' }
    )
  }
  return email.toLowerCase().trim()
}

export function validatePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw createError(
      ErrorCode.INVALID_INPUT,
      'Invalid phone number format',
      400,
      { field: 'phone' }
    )
  }
  return cleaned
}

export function validatePassword(password: string): string {
  if (password.length < 8) {
    throw createError(
      ErrorCode.INVALID_INPUT,
      'Password must be at least 8 characters long',
      400,
      { field: 'password' }
    )
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw createError(
      ErrorCode.INVALID_INPUT,
      'Password must contain uppercase, lowercase, and numbers',
      400,
      { field: 'password' }
    )
  }
  
  return password
}