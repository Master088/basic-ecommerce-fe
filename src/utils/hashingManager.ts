import CryptoJS from 'crypto-js'

// Utility: Decode hex string to WordArray
const hexDecode = (s: string): CryptoJS.lib.WordArray => CryptoJS.enc.Hex.parse(s)

// Utility: Encode WordArray to hex string
const hexEncode = (b: CryptoJS.lib.WordArray): string => CryptoJS.enc.Hex.stringify(b)

// Utility: Get decoded encryption key from env
const getDecodedKey = (): CryptoJS.lib.WordArray => hexDecode(import.meta.env.VITE_ENCRYPTION_KEY as string)

// AES Encrypt a value (string or number) using CFB mode and custom IV
export const encryptMessage = (value: string | number): string => {
  try {
    const decodedKey = getDecodedKey()
    const iv = CryptoJS.lib.WordArray.random(16)

    const ciphertext = CryptoJS.AES.encrypt(value.toString(), decodedKey, {
      iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    })

    const combined = iv.clone().concat(ciphertext.ciphertext)
    return hexEncode(combined)
  } catch (error) {
    console.error('Encryption error:', error)
    throw error
  }
}

// AES Decrypt an encrypted hex string
export const decryptMessage = (encryptedValue: string): string | null => {
  try {
    const decodedKey = getDecodedKey()
    const encryptedHex = hexDecode(encryptedValue)

    const iv = encryptedHex.clone()
    iv.sigBytes = 16
    iv.clamp()

    const ciphertext = encryptedHex.clone()
    ciphertext.words.splice(0, 4)
    ciphertext.sigBytes -= 16

    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, decodedKey, {
      iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

// Serialize data (object/array/primitive) to string
const serializeData = (data: unknown): string => JSON.stringify(data)

// Deserialize data from encrypted string
const deserializeData = (encryptedData: string): unknown => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.VITE_ENCRYPTION_KEY as string)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Error deserializing data:', error)
    return null
  }
}

// Encrypt cookie value using AES with simple password key
export const encryptCookie = (message: unknown): string | null => {
  try {
    const serialized = serializeData(message)
    return CryptoJS.AES.encrypt(serialized, import.meta.env.VITE_ENCRYPTION_KEY as string).toString()
  } catch (error) {
    console.error('Error encrypting message:', error)
    return null
  }
}

// Decrypt AES-encrypted cookie value
export const decryptCookie = (encryptedMessage: string): unknown => {
  try {
    return deserializeData(encryptedMessage)
  } catch (error) {
    console.error('Error decrypting message:', error)
    return null
  }
}

// Encode UTF-8 to Base64
export const utf8ToB64 = (str: string = ''): string => {
  return btoa(encodeURIComponent(str))
}

// Decode Base64 to UTF-8
export const b64ToUtf8 = (str: string = ''): string => {
  return decodeURIComponent(atob(str))
}
