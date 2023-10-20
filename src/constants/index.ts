import 'dotenv/config'

export const tokens = {
  ETH: {
    ETHEREUM:
      process.env.NETWORK === 'mainnet'
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91'
        : '0x20b28b1e4665fff290650586ad76e977eab90c5d',
    ARBITRUM: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    OPTIMISM: '0x4200000000000000000000000000000000000006',
    LINEA: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
  },
  USDC: {
    ETHEREUM: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4'
        : '0x0faf6df7054946141266420b43783387a78d82a9',
    ARBITRUM: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    OPTIMISM: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    LINEA: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
  },
  USDT: {
    ETHEREUM: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ZKSYNC_ERA:
      process.env.NETWORK === 'mainnet'
        ? '0x493257fd37edb34451f62edf8d2a0c418852ba4c'
        : '0xfced12debc831d3a84931c63687c395837d42c2b',
    ARBITRUM: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    OPTIMISM: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    LINEA: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
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
