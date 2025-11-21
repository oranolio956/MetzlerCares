import { createError, ErrorCode } from './errorHandler'
import { securityLogger } from './logger'
import type { RequestEvent } from '@sveltejs/kit'

interface FileValidationResult {
  valid: boolean
  error?: string
  sanitized?: boolean
}

interface VirusScanResult {
  clean: boolean
  threats?: string[]
  error?: string
}

export class FileSecurityValidator {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]

  private readonly DANGEROUS_EXTENSIONS = [
    '.exe',
    '.bat',
    '.cmd',
    '.com',
    '.pif',
    '.scr',
    '.vbs',
    '.js',
    '.jar',
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz'
  ]

  private readonly DANGEROUS_PATTERNS = [
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ]

  async validateFile(file: File, event: RequestEvent): Promise<FileValidationResult> {
    try {
      // Basic validation
      const basicValidation = this.validateBasicFile(file)
      if (!basicValidation.valid) {
        await this.logSecurityEvent('file_validation_failed', event, {
          filename: file.name,
          reason: basicValidation.error
        })
        return basicValidation
      }

      // Content validation
      const contentValidation = await this.validateFileContent(file, event)
      if (!contentValidation.valid) {
        return contentValidation
      }

      // Virus scan (simulated - in production, integrate with actual AV service)
      const virusScan = await this.performVirusScan(file)
      if (!virusScan.clean) {
        await this.logSecurityEvent('virus_detected', event, {
          filename: file.name,
          threats: virusScan.threats
        })
        return {
          valid: false,
          error: 'Security scan detected potential threats'
        }
      }

      return { valid: true }
    } catch (err) {
      securityLogger.error('File validation error', {
        error: err instanceof Error ? err : new Error(String(err)),
        context: 'file_validation',
        ipAddress: event.getClientAddress(),
        userAgent: event.request.headers.get('user-agent') || undefined,
        requestId: event.locals.requestId,
        userId: event.locals.user?.id
      })

      return {
        valid: false,
        error: 'File validation failed due to system error'
      }
    }
  }

  private validateBasicFile(file: File): FileValidationResult {
    // Size check
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }

    // MIME type check
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      return { valid: false, error: `File type '${file.type}' is not allowed` }
    }

    // Extension check
    const extension = this.getFileExtension(file.name).toLowerCase()
    if (this.DANGEROUS_EXTENSIONS.includes(extension)) {
      return { valid: false, error: `File extension '${extension}' is not allowed` }
    }

    // Filename validation
    if (!this.isValidFilename(file.name)) {
      return { valid: false, error: 'Invalid filename' }
    }

    return { valid: true }
  }

  private async validateFileContent(file: File, event: RequestEvent): Promise<FileValidationResult> {
    try {
      // Read first few KB of file for content inspection
      const buffer = await file.slice(0, 8192).arrayBuffer()
      const content = new TextDecoder('utf-8', { fatal: false }).decode(buffer)

      // Check for dangerous patterns
      for (const pattern of this.DANGEROUS_PATTERNS) {
        if (pattern.test(content)) {
          await this.logSecurityEvent('dangerous_content_detected', event, {
            filename: file.name,
            pattern: pattern.toString()
          })
          return {
            valid: false,
            error: 'File contains potentially dangerous content'
          }
        }
      }

      // PDF-specific validation
      if (file.type === 'application/pdf') {
        return this.validatePDFContent(content, event)
      }

      // Image validation
      if (file.type.startsWith('image/')) {
        return this.validateImageContent(file)
      }

      return { valid: true }
    } catch (err) {
      console.error('Content validation error:', err)
      return { valid: false, error: 'Unable to validate file content' }
    }
  }

  private validatePDFContent(content: string, event: RequestEvent): FileValidationResult {
    // Check for PDF-specific vulnerabilities
    const pdfPatterns = [
      /\/JS\s+/g, // JavaScript in PDF
      /\/Launch\s+/g, // Launch actions
      /\/EmbeddedFile/g // Embedded files
    ]

    for (const pattern of pdfPatterns) {
      if (pattern.test(content)) {
        this.logSecurityEvent('pdf_security_risk', event, {
          pattern: pattern.toString()
        })
        return {
          valid: false,
          error: 'PDF contains potentially unsafe elements'
        }
      }
    }

    return { valid: true }
  }

  private async validateImageContent(file: File): Promise<FileValidationResult> {
    return new Promise(resolve => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)

        // Check image dimensions (prevent decompression bombs)
        if (img.width > 10000 || img.height > 10000) {
          resolve({
            valid: false,
            error: 'Image dimensions too large'
          })
          return
        }

        resolve({ valid: true })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({
          valid: false,
          error: 'Invalid image file'
        })
      }

      img.src = url
    })
  }

  private async performVirusScan(file: File): Promise<VirusScanResult> {
    // This is a simulated virus scan
    // In production, integrate with actual antivirus services like:
    // - ClamAV
    // - VirusTotal API
    // - AWS Malware Protection

    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 100))

      // Simulate detection of obviously malicious patterns
      const filename = file.name.toLowerCase()
      const suspiciousPatterns = ['virus', 'malware', 'trojan', 'worm', 'backdoor', 'keylogger']

      const detectedThreats = suspiciousPatterns.filter(pattern => filename.includes(pattern))

      if (detectedThreats.length > 0) {
        return {
          clean: false,
          threats: detectedThreats
        }
      }

      return { clean: true }
    } catch (err) {
      return {
        clean: false,
        error: 'Virus scan failed'
      }
    }
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : ''
  }

  private isValidFilename(filename: string): boolean {
    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return false
    }

    // Check filename length
    if (filename.length > 255) {
      return false
    }

    // Check for null bytes
    if (filename.includes('\0')) {
      return false
    }

    return true
  }

  private async logSecurityEvent(type: string, event: RequestEvent, details: Record<string, any>): Promise<void> {
    securityLogger.info('Security event', {
      type: type as any,
      ipAddress: event.getClientAddress(),
      userAgent: event.request.headers.get('user-agent') || '',
      requestId: event.locals.requestId,
      userId: event.locals.user?.id,
      details
    })
  }
}

export const fileSecurityValidator = new FileSecurityValidator()
