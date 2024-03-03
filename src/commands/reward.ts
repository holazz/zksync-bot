import axios from 'axios'
import { wallets } from '../configs/wallets'

async function socketscan(address: string) {
  const res = await axios.get(
    'https://microservices.socket.tech/loki/rewards/get-claim-data',
    {
      params: {
        address,
      },
    },
  )
  return res.data.result
}

async function across(address: string) {
  const res = await axios.get(
    'https://public.api.across.to/rewards/op-rebates',
    {
      params: {
        userAddress: address,
        limit: 10,
        offset: 0,
      },
    },
  )
  return res.data
}

async function reward() {
  const promises = wallets.map(async (wallet) => {
    const socketscanReward = await socketscan(wallet.address)
    const acrossReward = await across(wallet.address)
    return {
      label: wallet.label,
      address: wallet.address,
      socketscanReward,
      acrossReward,
    }
  })
  const res = await Promise.all(promises)
  console.log(res)
}

reward()
