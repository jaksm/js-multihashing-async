import { Buffer } from 'buffer'
import sha3, { Message } from 'js-sha3'
import mur from 'murmurhash3js-revisited'
import { factory as sha } from './sha'
import { fromNumberTo32BitBuf } from './utils'

// Note that although this function doesn't do any asynchronous work, we mark
// the function as async because it must return a Promise to match the API
// for other functions that do perform asynchronous work (see sha.browser.js)
// eslint-disable-next-line
type HashAlgorithm = 'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512' | 'shake-128' | 'shake-256' | 'keccak-224' | 'keccak-256' | 'keccak-384' | 'keccak-512' | 'murmur3-128' | 'murmur3-32'
const hash = (algorithm: HashAlgorithm) => async (data: Message): Promise<Buffer> => {
  switch (algorithm) {
    case 'sha3-224':
      return Buffer.from(sha3.sha3_224.arrayBuffer(data))
    case 'sha3-256':
      return Buffer.from(sha3.sha3_256.arrayBuffer(data))
    case 'sha3-384':
      return Buffer.from(sha3.sha3_384.arrayBuffer(data))
    case 'sha3-512':
      return Buffer.from(sha3.sha3_512.arrayBuffer(data))
    case 'shake-128':
      return Buffer.from(sha3.shake128.create(128).update(data).arrayBuffer())
    case 'shake-256':
      return Buffer.from(sha3.shake256.create(256).update(data).arrayBuffer())
    case 'keccak-224':
      return Buffer.from(sha3.keccak224.arrayBuffer(data))
    case 'keccak-256':
      return Buffer.from(sha3.keccak256.arrayBuffer(data))
    case 'keccak-384':
      return Buffer.from(sha3.keccak384.arrayBuffer(data))
    case 'keccak-512':
      return Buffer.from(sha3.keccak512.arrayBuffer(data))
    case 'murmur3-128':
      return Buffer.from(mur.x64.hash128(data), 'hex')
    case 'murmur3-32':
      return fromNumberTo32BitBuf(mur.x86.hash32(data))

    default:
      throw new TypeError(`${algorithm} is not a supported algorithm`)
  }
}

export const identity = (data: ArrayBuffer | SharedArrayBuffer): Buffer => Buffer.from(data)

export const sha1 = sha('sha1')
export const sha2256 = sha('sha2-256')
export const sha2512 = sha('sha2-512')
export const dblSha2256 = sha('dbl-sha2-256')
export const sha3224 = hash('sha3-224')
export const sha3256 = hash('sha3-256')
export const sha3384 = hash('sha3-384')
export const sha3512 = hash('sha3-512')
export const shake128 = hash('shake-128')
export const shake256 = hash('shake-256')
export const keccak224 = hash('keccak-224')
export const keccak256 = hash('keccak-256')
export const keccak384 = hash('keccak-384')
export const keccak512 = hash('keccak-512')
export const murmur3128 = hash('murmur3-128')
export const murmur332 = hash('murmur3-32')
export { default as addBlake } from './blake'
