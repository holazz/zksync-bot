import dmail from './dmail'
import syncswap from './syncswap'
import zksdomain from './zksdomain'
import crossChainNFT from './crossChainNFT'
import mintSquare from './mintSquare'
import nfts2me from './nfts2me'

export default [
  dmail,
  syncswap,
  zksdomain,
  crossChainNFT,
  mintSquare,
  nfts2me,
].sort((a, b) => a.value.localeCompare(b.value))
