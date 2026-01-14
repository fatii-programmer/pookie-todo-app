/**
 * Environment Variable Validation
 *
 * Centralized environment variable loading with:
 * - Loud failure on missing critical vars
 * - Server-side logging
 * - Runtime validation
 */

interface EnvironmentConfig {
  OPENAI_API_KEY: string
  JWT_SECRET: string
  DATABASE_PATH: string
  NODE_ENV: string
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

/**
 * Load and validate environment variables
 * Fails LOUDLY if critical vars are missing
 */
function loadEnvironment(): EnvironmentConfig {
  const errors: string[] = []

  // Critical: OpenAI API Key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is not set')
    console.error('❌ FATAL: OPENAI_API_KEY environment variable is MISSING')
    console.error('   File: .env.local or .env')
    console.error('   Fix: Add OPENAI_API_KEY=sk-proj-your-key-here')
  } else if (OPENAI_API_KEY.includes('REPLACE-WITH') || OPENAI_API_KEY.includes('your-')) {
    errors.push('OPENAI_API_KEY appears to be a placeholder')
    console.error('❌ FATAL: OPENAI_API_KEY is a PLACEHOLDER, not a real key')
    console.error('   Current value starts with:', OPENAI_API_KEY.substring(0, 20))
    console.error('   Fix: Replace with actual key from https://platform.openai.com/api-keys')
  } else if (!OPENAI_API_KEY.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY has invalid format')
    console.error('❌ FATAL: OPENAI_API_KEY format is INVALID')
    console.error('   Should start with: sk-')
    console.error('   Currently starts with:', OPENAI_API_KEY.substring(0, 10))
  } else {
    console.log('✅ OPENAI_API_KEY loaded successfully')
    console.log('   Format:', OPENAI_API_KEY.substring(0, 20) + '...' + OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4))
  }

  // Critical: JWT Secret
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    errors.push('JWT_SECRET is not set')
    console.error('❌ WARNING: JWT_SECRET is MISSING (authentication may fail)')
  } else if (JWT_SECRET.includes('REPLACE-WITH') || JWT_SECRET.includes('your-')) {
    errors.push('JWT_SECRET appears to be a placeholder')
    console.error('❌ WARNING: JWT_SECRET is a PLACEHOLDER')
  } else {
    console.log('✅ JWT_SECRET loaded successfully')
  }

  // Optional: Database path
  const DATABASE_PATH = process.env.DATABASE_PATH || './data/tasks.json'
  console.log('✅ DATABASE_PATH:', DATABASE_PATH)

  // Node environment
  const NODE_ENV = process.env.NODE_ENV || 'development'
  console.log('✅ NODE_ENV:', NODE_ENV)

  // If critical errors exist, throw
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    console.error('\n' + '='.repeat(60))
    console.error('ENVIRONMENT VALIDATION FAILED')
    console.error('='.repeat(60))
    console.error(errorMessage)
    console.error('\nThe chatbot WILL NOT WORK until you fix these issues.')
    console.error('See: QUICKFIX.md for instructions')
    console.error('='.repeat(60) + '\n')

    // Don't throw in development - allow app to start with warnings
    if (NODE_ENV === 'production') {
      throw new EnvironmentError(errorMessage)
    }
  }

  return {
    OPENAI_API_KEY: OPENAI_API_KEY || '',
    JWT_SECRET: JWT_SECRET || '',
    DATABASE_PATH,
    NODE_ENV
  }
}

// Load environment on module import
console.log('\n🔍 Loading environment variables...')
export const env = loadEnvironment()
console.log('✅ Environment validation complete\n')

// Export validation function for runtime checks
export function validateApiKey(): { valid: boolean; error?: string } {
  if (!env.OPENAI_API_KEY) {
    return {
      valid: false,
      error: 'OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local'
    }
  }

  if (env.OPENAI_API_KEY.includes('REPLACE-WITH') || env.OPENAI_API_KEY.includes('your-')) {
    return {
      valid: false,
      error: 'OpenAI API key is a placeholder. Replace with actual key from https://platform.openai.com/api-keys'
    }
  }

  if (!env.OPENAI_API_KEY.startsWith('sk-')) {
    return {
      valid: false,
      error: 'OpenAI API key format is invalid. Should start with sk-'
    }
  }

  return { valid: true }
}
