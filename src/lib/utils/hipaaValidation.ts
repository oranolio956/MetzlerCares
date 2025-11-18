/**
 * HIPAA-Comprehensive Input Validation and Sanitization
 * 
 * Enhanced validation utilities with security-focused measures for healthcare data
 */

import { error } from '@sveltejs/kit';
import { sanitizeInput, validateAndSanitizeForm, VALIDATION_RULES, validateField } from './validation';

/**
 * Dangerous patterns that should be rejected for HIPAA compliance
 */
const DANGEROUS_PATTERNS = [
  // SQL Injection patterns
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|declare|cast|convert)\b|--|\/\*|\*\/)/gi,
  
  // XSS patterns
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  
  // Command injection
  /[;&|`]/g,
  /\$\(/g,
  /\{\$/g,
  
  // Path traversal
  /\.\.\//g,
  /\.\.\\/g,
  
  // PHP injection
  /<\?php/gi,
  /\$_\w+/g,
  
  // XML/XXE injection
  /<!ENTITY/gi,
  /SYSTEM\s+["']/gi,
  
  // LDAP injection
  /[\*\(\)\\\|\&=]/g,
  
  // NoSQL injection
  /\$\w*\./g,
  /\{.*\$\w+/g
];

/**
 * HIPAA-specific validation patterns
 */
const HIPAA_PATTERNS = {
  // PHI (Protected Health Information) patterns
  ssn: /^\d{3}-\d{2}-\d{4}$|^\d{9}$/,
  
  // Basic date patterns (more restrictive for HIPAA)
  date: /^\d{4}-\d{2}-\d{2}$/,
  
  // Medical record numbers (alphanumeric, specific formats)
  mrn: /^[A-Z]{2,3}\d{6,10}$/,
  
  // Insurance policy numbers
  insurancePolicy: /^[A-Z0-9]{8,20}$/,
  
  // Phone numbers (more restrictive)
  phone: /^\+1\d{10}$|^1\d{10}$|^\d{10}$/,
  
  // Email (stricter)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

/**
 * HIPAA validation messages
 */
const HIPAA_MESSAGES = {
  dangerousContent: 'Potentially dangerous content detected',
  phiDetected: 'Protected Health Information detected in unexpected field',
  invalidFormat: 'Invalid format for healthcare data',
  suspiciousInput: 'Suspicious input pattern detected',
  injectionAttempt: 'Potential injection attack detected'
};

/**
 * Enhanced input validation with security scanning
 */
export function validateSecureInput(input: string, fieldName: string = 'input'): {
  isValid: boolean;
  message?: string;
  sanitized?: string;
} {
  // Check for dangerous patterns first
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      console.warn(`Security warning: Dangerous pattern detected in ${fieldName}`, {
        pattern: pattern.toString(),
        inputLength: input.length,
        timestamp: new Date().toISOString()
      });
      
      return {
        isValid: false,
        message: HIPAA_MESSAGES.dangerousContent,
        sanitized: sanitizeInput(input)
      };
    }
  }
  
  // Check for PHI in unexpected places
  if (fieldName !== 'ssn' && fieldName !== 'social_security_number') {
    if (HIPAA_PATTERNS.ssn.test(input)) {
      console.warn(`HIPAA warning: SSN detected in non-SSN field ${fieldName}`, {
        timestamp: new Date().toISOString()
      });
      
      return {
        isValid: false,
        message: HIPAA_MESSAGES.phiDetected,
        sanitized: '[REDACTED_SSN]'
      };
    }
  }
  
  // Length validation for HIPAA compliance
  if (input.length > 1000) {
    return {
      isValid: false,
      message: 'Input exceeds maximum allowed length (1000 characters)',
      sanitized: input.substring(0, 1000)
    };
  }
  
  // Basic sanitization
  const sanitized = sanitizeInput(input);
  
  return {
    isValid: true,
    sanitized
  };
}

/**
 * Validate form data with HIPAA security measures
 */
export function validateSecureForm(
  formData: Record<string, any>,
  rules: Record<string, any>
): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
  securityWarnings: string[];
} {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, any> = {};
  const securityWarnings: string[] = [];
  
  for (const [fieldName, value] of Object.entries(formData)) {
    // Skip null/undefined values
    if (value === null || value === undefined) {
      sanitizedData[fieldName] = value;
      continue;
    }
    
    // Convert to string for validation
    const stringValue = String(value);
    
    // Security validation
    const securityCheck = validateSecureInput(stringValue, fieldName);
    
    if (!securityCheck.isValid) {
      errors[fieldName] = securityCheck.message || 'Invalid input';
      if (securityCheck.sanitized !== undefined) {
        sanitizedData[fieldName] = securityCheck.sanitized;
      }
      continue;
    }
    
    // If we have a sanitized value, use it
    if (securityCheck.sanitized !== undefined) {
      sanitizedData[fieldName] = securityCheck.sanitized;
    } else {
      sanitizedData[fieldName] = stringValue;
    }
    
    // Apply field-specific validation rules if provided
    if (rules[fieldName]) {
      const fieldValidation = validateField(sanitizedData[fieldName], rules[fieldName]);
      if (!fieldValidation.isValid) {
        errors[fieldName] = fieldValidation.message || 'Invalid field value';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
    securityWarnings
  };
}

/**
 * Validate healthcare-specific data
 */
export function validateHealthcareData(
  data: Record<string, any>,
  dataType: 'patient' | 'insurance' | 'medical' | 'contact'
): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
} {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, any> = {};
  
  const rules = getHealthcareValidationRules(dataType);
  
  for (const [fieldName, value] of Object.entries(data)) {
    if (rules[fieldName]) {
      const validation = validateSecureInput(String(value), fieldName);
      
      if (!validation.isValid) {
        errors[fieldName] = validation.message || 'Invalid healthcare data';
        continue;
      }
      
      // Apply healthcare-specific validation
      const healthcareValidation = validateField(
        validation.sanitized || value,
        rules[fieldName]
      );
      
      if (!healthcareValidation.isValid) {
        errors[fieldName] = healthcareValidation.message || 'Invalid healthcare data format';
        continue;
      }
      
      sanitizedData[fieldName] = validation.sanitized || value;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}

/**
 * Get healthcare-specific validation rules
 */
function getHealthcareValidationRules(dataType: string): Record<string, any[]> {
  const baseRules = {
    firstName: [VALIDATION_RULES.firstName],
    lastName: [VALIDATION_RULES.lastName],
    email: [VALIDATION_RULES.email],
    phone: [VALIDATION_RULES.phone],
    address: [VALIDATION_RULES.address],
    city: [VALIDATION_RULES.city],
    state: [VALIDATION_RULES.state],
    zipCode: [VALIDATION_RULES.zipCode]
  };
  
  switch (dataType) {
    case 'patient':
      return {
        ...baseRules,
        dateOfBirth: [VALIDATION_RULES.dateOfBirth],
        ssn: [VALIDATION_RULES.ssn]
      };
      
    case 'insurance':
      return {
        ...baseRules,
        policyNumber: [{
          required: true,
          pattern: /^[A-Z0-9]{8,20}$/,
          message: 'Insurance policy number must be 8-20 alphanumeric characters'
        }],
        groupNumber: [{
          required: false,
          pattern: /^[A-Z0-9]{0,20}$/,
          message: 'Group number must be alphanumeric'
        }]
      };
      
    case 'medical':
      return {
        condition: [{
          required: true,
          maxLength: 500,
          pattern: /^[a-zA-Z0-9\s,.'-]+$/,
          message: 'Medical condition must contain only letters, numbers, and basic punctuation'
        }],
        medication: [{
          required: false,
          maxLength: 200,
          pattern: /^[a-zA-Z0-9\s,.'-]+$/,
          message: 'Medication names must contain only letters, numbers, and basic punctuation'
        }]
      };
      
    case 'contact':
      return baseRules;
      
    default:
      return baseRules;
  }
}

/**
 * Sanitize data for database storage (HIPAA compliance)
 */
export function sanitizeForDatabase(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      // Apply comprehensive sanitization
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      // Recursively sanitize objects
      sanitized[key] = sanitizeForDatabase(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate file uploads for HIPAA compliance
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    };
  }
  
  // Check filename for dangerous patterns
  const dangerousFilenamePatterns = /[<>:"|?*\x00-\x1f]/g;
  if (dangerousFilenamePatterns.test(file.name)) {
    return {
      isValid: false,
      error: 'Filename contains invalid characters'
    };
  }
  
  return { isValid: true };
}

/**
 * Log security events for HIPAA audit trail
 */
export function logSecurityEvent(
  eventType: string,
  details: Record<string, any>,
  severity: 'low' | 'medium' | 'high' = 'medium'
): void {
  const event = {
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    details,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };
  
  // In production, this would send to audit logging service
  console.log('HIPAA Security Event:', JSON.stringify(event));
  
  // For high severity events, also log to error
  if (severity === 'high') {
    console.error('HIGH SEVERITY HIPAA SECURITY EVENT:', event);
  }
}