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
  console.log(
    res
      .filter(
        (r) => r.socketscanReward.length || r.acrossReward.deposits.length,
      )
      .map((r) => {
        return {
          label: r.label,
          address: r.address,
          socketscanReward: r.socketscanReward.length
            ? 'https://www.socketscan.io/rewards'
            : '',
          acrossReward: r.acrossReward.deposits.length
            ? 'https://app.across.to/rewards/optimism-grant-program'
            : '',
        }
      }),
  )
}

reward()
