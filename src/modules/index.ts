import dmail from './dmail'
import syncswap from './syncswap'
import zksdomain from './zksdomain'

export default [dmail, syncswap, zksdomain].sort((a, b) =>
  a.value.localeCompare(b.value)
)
