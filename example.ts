import Multihashing from './src'

(async () => {
  const buf = Buffer.from('beep boop')

  console.log(
    await Multihashing(buf, 'sha1'),
    await Multihashing(buf, 'sha2-256'),
    await Multihashing(buf, 'sha2-512')
  )
})()
