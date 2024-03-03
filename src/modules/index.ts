// import syncswap from './syncswap'
// import zksdomain from './zksdomain'
// import omnisea from './omnisea'
// import safe from './safe'
import erc20Approval from './erc20-approval'
// import erc721Approval from './erc721-approval'
import dmail from './dmail'

export default [
  // syncswap,
  // zksdomain,
  // omnisea,
  // safe,
  ...erc20Approval,
  // ...erc721Approval,
  dmail,
].sort((a, b) => a.value.localeCompare(b.value))
