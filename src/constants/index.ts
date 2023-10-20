import 'dotenv/config'

export const tokens = {
  ETH: {
    ETHEREUM:
      process.env.NETWORK === 'mainnet'
        ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91'
        : '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    ARBITRUM: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    OPTIMISM: '0x4200000000000000000000000000000000000006',
    LINEA: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  },
  USDC: {
    ETHEREUM: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4'
        : '0x0faf6df7054946141266420b43783387a78d82a9',
    ARBITRUM: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    OPTIMISM: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    LINEA: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
  },
  USDT: {
    ETHEREUM: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x493257fd37edb34451f62edf8d2a0c418852ba4c'
        : '0xfced12debc831d3a84931c63687c395837d42c2b',
    ARBITRUM: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    OPTIMISM: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    LINEA: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
  },
}

export const chains = {
  ETHEREUM:
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  ZKSYNC_ERA:
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.era.zksync.io'
      : 'https://testnet.era.zksync.dev',
  ARBITRUM:
    process.env.NETWORK === 'mainnet'
      ? 'https://arbitrum-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://arbitrum-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  OPTIMISM:
    process.env.NETWORK === 'mainnet'
      ? 'https://optimism-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://optimism-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
  LINEA:
    process.env.NETWORK === 'mainnet'
      ? 'https://linea-mainnet.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7'
      : 'https://linea-goerli.infura.io/v3/533dfd23557045fdb3700f2e4331f0b7',
}
