import { ValidationError } from './errorHandler'
import { logger } from './logger'

export interface FileValidationOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[] // MIME types
  allowedExtensions?: string[] // file extensions
  scanForViruses?: boolean
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedFileName?: string
}

// Common MIME types for different file categories
export const MIME_TYPES = {
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
} as const

// Suspicious patterns that might indicate malicious content
const SUSPICIOUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /document\.write/gi,
  /window\./gi,
  /\.innerHTML/gi
]

export function validateFile(file: File, options: FileValidationOptions = {}): FileValidationResult {
  const errors: string[] = []

  try {
    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      const maxSizeMB = options.maxSize / (1024 * 1024)
      errors.push(`File size exceeds maximum allowed size of ${maxSizeMB}MB`)
    }

    // Validate MIME type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`File type '${file.type}' is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`)
    }

    // Validate file extension
    if (options.allowedExtensions) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!options.allowedExtensions.includes(extension)) {
        errors.push(
          `File extension '${extension}' is not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`
        )
      }
    }

    // Sanitize filename
    const sanitizedFileName = sanitizeFileName(file.name)
    if (sanitizedFileName !== file.name) {
      logger.warn('File name sanitized', { original: file.name, sanitized: sanitizedFileName })
    }

    // Basic content scanning for text files
    if (options.scanForViruses && file.type.startsWith('text/')) {
      // This is a basic check - in production, integrate with actual virus scanning service
      scanFileContent(file).catch(err => {
        logger.error('File content scan failed', { error: err.message, fileName: file.name })
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedFileName
    }
  } catch (error) {
    logger.error('File validation error', { error: (error as Error).message, fileName: file.name })
    return {
      isValid: false,
      errors: ['File validation failed']
    }
  }
}

export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  const baseName = fileName.split('/').pop()?.split('\\').pop() || fileName

  // Remove special characters that could cause issues
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.') // Prevent multiple consecutive dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .toLowerCase()

  // Ensure it doesn't start with a dot (hidden files)
  return sanitized.startsWith('.') ? 'file' + sanitized : sanitized
}

async function scanFileContent(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const content = event.target?.result as string

        // Check for suspicious patterns
        for (const pattern of SUSPICIOUS_PATTERNS) {
          if (pattern.test(content)) {
            logger.warn('Suspicious content detected in file', {
              fileName: file.name,
              pattern: pattern.toString()
            })
            resolve(false)
            return
          }
        }

        resolve(true)
      } catch (error) {
        reject(new Error('Content scan failed'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file content'))
    }

    reader.readAsText(file.slice(0, 10000)) // Read first 10KB
  })
}

export function validateFileUpload(
  files: FileList | File[],
  options: FileValidationOptions = {}
): FileValidationResult[] {
  const fileArray = Array.from(files)
  return fileArray.map(file => validateFile(file, options))
}

export function createFileValidationError(result: FileValidationResult): ValidationError {
  return new ValidationError('File validation failed', { errors: result.errors })
}

// Predefined validation configurations for common use cases
export const FILE_VALIDATION_PRESETS = {
  PARTNER_DOCUMENTS: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [...MIME_TYPES.DOCUMENTS, ...MIME_TYPES.IMAGES],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    scanForViruses: true
  },

  IMAGES_ONLY: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: MIME_TYPES.IMAGES,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    scanForViruses: true
  },

  DOCUMENTS_ONLY: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: MIME_TYPES.DOCUMENTS,
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
    scanForViruses: true
  }
} as const
