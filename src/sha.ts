/* eslint-disable require-await */
import crypto, { BinaryLike } from 'crypto'
import multihash from 'multihashes'

// Note that although this function doesn't do any asynchronous work, we mark
// the function as async because it must return a Promise to match the API
// for other functions that do perform asynchronous work (see sha.browser.js)
// eslint-disable-next-line
type Algorithm = 'sha1' | 'sha2-256' | 'sha2-512' | 'dbl-sha2-256'
export const digest = async (data: BinaryLike, alg: Algorithm) => {
  switch (alg) {
    case 'sha1':
      return crypto.createHash('sha1').update(data).digest()
    case 'sha2-256':
      return crypto.createHash('sha256').update(data).digest()
    case 'sha2-512':
      return crypto.createHash('sha512').update(data).digest()
    case 'dbl-sha2-256': {
      const first = crypto.createHash('sha256').update(data).digest()
      return crypto.createHash('sha256').update(first).digest()
    }
    default:
      throw new Error(`${alg} is not a supported algorithm`)
  }
}

export const factory = (alg: Algorithm) => async (data: BinaryLike) => {
  return digest(data, alg)
}

export const multihashing = async(buf: Buffer, alg: Algorithm, length: number) => {
    const h = await digest(buf, alg) // arg length was probably a typo
    return multihash.encode(h, alg, length) 
}