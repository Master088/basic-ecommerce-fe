import {
  encryptCookie,
  decryptCookie,
  utf8ToB64,
  b64ToUtf8
} from '@/utils/hashingManager'

const isProduction = import.meta.env.VITE_APP_ENV === 'production'

export const setManageCookie = (
  key: string,
  str: unknown,
  exmins: number
): void => {
  try {
    const value = JSON.stringify(str)
    const encode = utf8ToB64(value)
    const d = new Date()
    d.setTime(d.getTime() + exmins * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    document.cookie = `${key}=${encode}; ${expires}; path=/; SameSite=Strict`
  } catch (error) {
    console.error('Error setting manage cookie:', error)
    throw error
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getManageCookie = (key: string): any => {
  const name = `${key}=`
  const cookies = document.cookie.split(';')
  for (let c of cookies) {
    c = c.trim()
    if (c.startsWith(name)) {
      try {
        const decode = b64ToUtf8(c.substring(name.length))
        return JSON.parse(decode)
      } catch (e) {
        console.error('Error parsing managed cookie:', e)
        return null
      }
    }
  }
  return null
}

export const deleteManageCookie = (key: string): void => {
  const d = new Date(0) // set to epoch time to expire immediately
  const expires = 'expires=' + d.toUTCString()
  document.cookie = `${key}=; path=/; ${expires}; SameSite=Strict`
}

export const setCookie = (
  name: string,
  value: string,
  days?: number,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Strict'
): void => {
  try {
    const encryptedValue = encryptCookie(value)
    if (!encryptedValue) throw new Error('Encryption failed')

    let cookie = `${name}=${encodeURIComponent(encryptedValue)}; path=/`

    if (days) {
      const expires = new Date(Date.now() + days * 86400000).toUTCString()
      cookie += `; expires=${expires}`
    }

    if (isProduction) {
      cookie += '; Secure'
    }

    cookie += `; SameSite=${sameSite}`

    document.cookie = cookie
  } catch (error) {
    console.error('Error setting encrypted cookie:', error)
    throw error
  }
}

export const getCookie = (name: string): string | null => {
  if (!name || typeof name !== 'string') {
    console.error('Invalid cookie name provided')
    return null
  }

  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';').map(cookie => cookie.trim())

  for (const cookie of cookies) {
    if (cookie.startsWith(nameEQ)) {
      const encryptedValue = cookie.substring(nameEQ.length)
      if (!encryptedValue) {
        console.warn('Cookie found, but the value is empty')
        return null
      }

      try {
        const decodedValue = decodeURIComponent(encryptedValue)
        const decryptedValue = decryptCookie(decodedValue)
        return decryptedValue || null
      } catch (error) {
        console.error('Error decrypting cookie:', error)
        return null
      }
    }
  }

  return null
}

export const eraseCookie = (name: string): void => {
  document.cookie = `${name}=; Max-Age=0; path=/; ${isProduction ? 'Secure; ' : ''}SameSite=Strict`
}

export const setLocalStorage = (key: string, str: unknown): void => {
  try {
    const value = JSON.stringify(str)
    const encode = utf8ToB64(value)
    localStorage.setItem(key, encode)
  } catch (error) {
    console.error('Error setting local storage:', error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key)
    if (item) {
      const decode = b64ToUtf8(item)
      return JSON.parse(decode)
    }
  } catch (error) {
    console.error('Error getting local storage:', error)
  }
  return null
}

export const deleteLocalStorage = (key: string): void => {
  localStorage.removeItem(key)
}

export const setSessionStorage = (
  key: string = '',
  str: unknown = {},
  isEncrypt: boolean = true
): void => {
  try {
    const value = JSON.stringify(str)
    const code = isEncrypt ? utf8ToB64(value) : value
    sessionStorage.setItem(key, code)
  } catch (error) {
    console.error('Error setting session storage:', error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSessionStorage = (
  key: string = '',
  isEncrypt: boolean = true
): unknown => {
  try {
    const item = sessionStorage.getItem(key)
    if (item) {
      const code = isEncrypt ? b64ToUtf8(item) : item
      return JSON.parse(code)
    }
  } catch (error) {
    console.error('Error getting session storage:', error)
  }
  return null
}

export const deleteSessionStorage = (key: string = ''): void => {
  sessionStorage.removeItem(key)
}
