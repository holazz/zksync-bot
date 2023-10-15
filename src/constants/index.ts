import 'dotenv/config'
import type { Token } from '../types'

export const tokens: Token = {
  ETH:
    process.env.NETWORK === 'mainnet'
      ? '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91'
      : '0x20b28b1e4665fff290650586ad76e977eab90c5d',
  USDC:
    process.env.NETWORK === 'mainnet'
      ? '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4'
      : '0x0faf6df7054946141266420b43783387a78d82a9',

  USDT:
    process.env.NETWORK === 'mainnet'
      ? '0x493257fd37edb34451f62edf8d2a0c418852ba4c'
      : '0xfced12debc831d3a84931c63687c395837d42c2b',
}
