import blake from 'blakejs'
import { Buffer } from 'buffer'

interface HashContext {
  b: Uint8Array,
  h: Uint32Array,
  t: number, // input count
  c: number, // pointer within buffer
  outlen: number // output length in bytes
}

type Blake2bInit = (outlen: number, key: Uint8Array | null) => HashContext
type Blake2bUpdate = (ctx: HashContext, input: Uint8Array) => void
type Blake2bFinal = (ctx: HashContext) => Uint8Array

interface BlakeOptions {
  init: Blake2bInit,
  update: Blake2bUpdate,
  digest: Blake2bFinal
}

const minB = 0xb201
const minS = 0xb241

const blake2b: BlakeOptions = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

const blake2s: BlakeOptions = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

// Note that although this function doesn't do any asynchronous work, we mark
// the function as async because it must return a Promise to match the API
// for other functions that do perform asynchronous work (see sha.browser.js)
// eslint-disable-next-line
const makeB2Hash = (size: number, hf: BlakeOptions) => async (data: Uint8Array): Promise<Buffer> => {
  const ctx = hf.init(size, null)
  hf.update(ctx, data)
  return Buffer.from(hf.digest(ctx))
}

export default (table: any) => {
  for (let i = 0; i < 64; i++) {
    table[minB + i] = makeB2Hash(i + 1, blake2b)
  }
  for (let i = 0; i < 32; i++) {
    table[minS + i] = makeB2Hash(i + 1, blake2s)
  }
}
