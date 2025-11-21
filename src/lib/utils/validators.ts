export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function normalizePhone(phone: string) {
  return phone.replace(/[\s\-\(\)]/g, '')
}

export function isValidPhone(phone: string) {
  return /^\+?[1-9]\d{1,14}$/.test(phone)
}
