/**
 * Security utilities for the application
 */

// Simple in-memory rate limiter for development
// For production, use Redis-based rate limiting like @upstash/ratelimit
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  limit: number    // Maximum requests per interval
}

/**
 * Simple rate limiter for API routes
 * Returns { success: boolean, remaining: number, resetTime: number }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, limit: 10 }
): { success: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const now = Date.now()
  const { interval, limit } = config

  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }

  const current = rateLimitStore.get(identifier)

  if (!current || current.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(identifier, { count: 1, resetTime: now + interval })
    return { success: true, remaining: limit - 1, resetTime: now + interval }
  }

  if (current.count >= limit) {
    // Rate limit exceeded
    return { 
      success: false, 
      remaining: 0, 
      resetTime: current.resetTime,
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    }
  }

  // Increment count
  current.count++
  return { success: true, remaining: limit - current.count, resetTime: current.resetTime }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}

/**
 * Sanitize error message for client response
 * Returns a generic message without exposing internal details
 */
export function sanitizeError(error: unknown): string {
  // Log the actual error for debugging
  console.error('Error:', error)
  
  // Return generic message to client
  return 'An unexpected error occurred. Please try again later.'
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { 
  valid: boolean
  errors: string[] 
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123']
  const lowerPassword = password.toLowerCase()
  if (commonPatterns.some(pattern => lowerPassword.includes(pattern))) {
    errors.push('Password contains common patterns')
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if a string contains potential XSS content
 */
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe\b/i,
    /<object\b/i,
    /<embed\b/i,
    /<img\b[^>]*onerror/i,
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
