import { describe, it, expect } from 'vitest'
import { validateField, validateAndSanitizeForm, VALIDATION_RULES } from './validation'

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const rules = [{ required: true }]

      expect(validateField('', rules).isValid).toBe(false)
      expect(validateField(null, rules).isValid).toBe(false)
      expect(validateField(undefined, rules).isValid).toBe(false)
      expect(validateField('test', rules).isValid).toBe(true)
    })

    it('should validate email format', () => {
      const rules = [VALIDATION_RULES.email]

      expect(validateField('invalid-email', rules).isValid).toBe(false)
      expect(validateField('test@example.com', rules).isValid).toBe(true)
    })

    it('should validate minimum length', () => {
      const rules = [{ minLength: 3 }]

      expect(validateField('ab', rules).isValid).toBe(false)
      expect(validateField('abc', rules).isValid).toBe(true)
    })
  })

  describe('validateAndSanitizeForm', () => {
    it('should validate and sanitize form data', () => {
      const formData = {
        fullName: 'John Doe',
        email: 'john@example.com'
      }

      const rules = {
        fullName: [VALIDATION_RULES.fullName],
        email: [VALIDATION_RULES.email]
      }

      const result = validateAndSanitizeForm(formData, rules)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
      expect(result.sanitizedData.fullName).toBe('John Doe')
      expect(result.sanitizedData.email).toBe('john@example.com')
    })

    it('should return validation errors', () => {
      const formData = {
        email: 'invalid-email'
      }

      const rules = {
        email: [VALIDATION_RULES.email]
      }

      const result = validateAndSanitizeForm(formData, rules)

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should sanitize input', () => {
      const formData = {
        name: '<script>alert("xss")</script>John'
      }

      const rules = {
        name: [VALIDATION_RULES.fullName]
      }

      const result = validateAndSanitizeForm(formData, rules)

      expect(result.sanitizedData.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;John')
    })
  })
})
