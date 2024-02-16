import 'dotenv/config'

export default [
  {
    title: 'Cross Chain NFT',
    value: 'crossChainNFT',
    contractAddress: '0x31DCD96f29BD32F3a1856247846E9d2f95C2b639',
  },
  {
    title: 'MintSquare',
    value: 'mintSquare',
    contractAddress: '0x53eC17BD635F7A54B3551E76Fd53Db8881028fC3',
  },
  {
    title: 'NFTs2Me',
    value: 'nfts2me',
    contractAddress:
      process.env.NETWORK === 'mainnet'
        ? '0x996A719fbc67f35a4344f73890C1172eb194A88c'
        : '0x8f38FfE39EBC1fCEd6bF29373E0fE56Dc88B4348',
  },
  {
    title: 'MailZero',
    value: 'mailzero',
    contractAddress: '0xc94025c2eA9512857BD8E1e611aB9b773b769350',
  },
  {
    title: 'Pop Social',
    value: 'popsocial',
    contractAddress: '0xE99950284Fb6E9E7682611967e7EC8EBB6Ec3907',
  },
  {
    title: 'Tavaera NFT',
    value: 'tavaeraNFT',
    contractAddress: '0x50b2b7092bcc15fbb8ac74fe9796cf24602897ad',
  },
  {
    title: 'Tavaera ID',
    value: 'tavaeraID',
    contractAddress: '0xd29Aa7bdD3cbb32557973daD995A3219D307721f',
  },
  {
    title: 'l2telegraph',
    value: 'l2telegraph',
    contractAddress: '0xD43A183C97dB9174962607A8b6552CE320eAc5aA',
  },
  {
    title: 'ZkStars',
    value: 'zkstars',
    contractAddress: '0xe7Ed1c47E1e2eA6e9126961df5d41798722A7656',
  },
]
