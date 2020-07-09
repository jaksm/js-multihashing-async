/* eslint-disable require-await */
import { Buffer } from 'buffer'
import multihash from 'multihashes'

// @ts-ignore
const crypto: Crypto = self.crypto || self.msCrypto // msCrypto does not exist

type DigestData = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer
type DigestAlgorithm = 'sha1' | 'sha2-256' | 'sha2-512' | 'dbl-sha2-256'
export const digest = async (data: DigestData, alg: DigestAlgorithm) => {
  // @ts-ignore
  if (typeof self === 'undefined' || (!self.crypto && !self.msCrypto)) { // msCrypto does not exist
    throw new Error(
      'Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context'
    )
  }
  switch (alg) {
    case 'sha1':
      return Buffer.from(await crypto.subtle.digest({ name: 'SHA-1' }, data))
    case 'sha2-256':
      return Buffer.from(await crypto.subtle.digest({ name: 'SHA-256' }, data))
    case 'sha2-512':
      return Buffer.from(await crypto.subtle.digest({ name: 'SHA-512' }, data))
    case 'dbl-sha2-256': {
      const d = await crypto.subtle.digest({ name: 'SHA-256' }, data)
      return Buffer.from(await crypto.subtle.digest({ name: 'SHA-256' }, d))
    }
    default:
      throw new Error(`${alg} is not a supported algorithm`)
  }
}

export const factory = (alg: DigestAlgorithm) => async (data: DigestData) => {
  return digest(data, alg)
}

export const multihashing = async (buf: DigestData, alg: DigestAlgorithm, length: number) => {
  const h = await digest(buf, alg)
  return multihash.encode(h, alg, length)
}