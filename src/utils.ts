import { Buffer } from 'buffer'

export const fromNumberTo32BitBuf = (number: number): Buffer => {
  const bytes = new Array(4)

  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }

  return Buffer.from(bytes)
}
