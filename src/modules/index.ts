import dmail from './dmail'
import syncswap from './syncswap'
import zksdomain from './zksdomain'
import crossChainNFT from './crossChainNFT'
import mintSquare from './mintSquare'
import nfts2me from './nfts2me'
import mailzero from './mailzero'
import popsocial from './popsocial'
import { tavaeraID, tavaeraNFT } from './tavaera'
import omnisea from './omnisea'
import l2telegraph from './l2telegraph'

export default [
  dmail,
  syncswap,
  zksdomain,
  crossChainNFT,
  mintSquare,
  nfts2me,
  mailzero,
  popsocial,
  tavaeraNFT,
  tavaeraID,
  omnisea,
  l2telegraph,
].sort((a, b) => a.value.localeCompare(b.value))
