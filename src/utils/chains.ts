import 'dotenv/config'
import {
  arbitrum as _arbitrum,
  arbitrumGoerli as _arbitrumGoerli,
  goerli as _goerli,
  linea as _linea,
  lineaTestnet as _lineaTestnet,
  mainnet as _mainnet,
  optimism as _optimism,
  optimismGoerli as _optimismGoerli,
  zkSync as _zkSync,
  zkSyncTestnet as _zkSyncTestnet,
} from 'viem/chains'

export const mainnet = process.env.NETWORK === 'mainnet' ? _mainnet : _goerli
export const zkSync =
  process.env.NETWORK === 'mainnet' ? _zkSync : _zkSyncTestnet
export const arbitrum =
  process.env.NETWORK === 'mainnet' ? _arbitrum : _arbitrumGoerli
export const optimism =
  process.env.NETWORK === 'mainnet' ? _optimism : _optimismGoerli
export const linea = process.env.NETWORK === 'mainnet' ? _linea : _lineaTestnet
