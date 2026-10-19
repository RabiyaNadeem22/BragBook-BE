/**
 * Simple structured console logger
 */
export const logger = {
  info: (...args) => console.log('ℹ️ [INFO]', ...args),
  success: (...args) => console.log('✅ [SUCCESS]', ...args),
  warn: (...args) => console.warn('⚠️ [WARN]', ...args),
  error: (...args) => console.error('❌ [ERROR]', ...args),
};
