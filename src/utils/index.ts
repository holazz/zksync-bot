import 'dotenv/config'
import { utils } from 'ethers'
import { Provider } from 'zksync-web3'
import c from 'picocolors'
import { resolvedWallets } from '../config'
import { getETHPrice } from '../api'
import type { Wallet } from 'ethers'
import type { Calls } from '../types'

export function getProvider() {
  return new Provider(
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.era.zksync.io'
      : 'https://testnet.era.zksync.dev'
  )
}

export async function estimateGasFee(signer: Wallet, calls: Calls) {
  const { contract, functionName, args } = calls
  const [gas, gasPrice, ethPrice] = await Promise.all([
    signer.estimateGas({
      to: contract.address,
      data: contract.interface.encodeFunctionData(functionName, args),
    }),
    signer.getGasPrice(),
    getETHPrice(),
  ])
  return Number(
    (Number(gas) * Number(utils.formatEther(gasPrice)) * ethPrice).toFixed(2)
  )
}

export async function sendTransaction(signer: Wallet, calls: Calls) {
  const nonce = await signer.getTransactionCount()
  const { contract, functionName, args } = calls
  const { hash } = await contract.connect(signer)[functionName](...args)
  return { address: signer.address, nonce, tx: hash }
}

export function ethToUsd(eth: number | string, ethPrice: number) {
  return Number((Number(eth) * ethPrice).toFixed(2))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function generateWalletTitle(address: string) {
  const wallet = resolvedWallets.find((w) => w.address === address)!
  return `${wallet.label} ${c.dim(`(${shortenAddress(wallet.address)})`)}`
}

export function retry<T>(
  fn: (...args: any[]) => Promise<T>,
  times = 0,
  delay = 0
) {
  return (...args: any[]): Promise<T> =>
    new Promise((resolve, reject) => {
      const attempt = async () => {
        try {
          resolve(await fn(...args))
        } catch (err) {
          if (times-- <= 0) {
            reject(err)
          } else {
            setTimeout(attempt, delay)
          }
        }
      }
      attempt()
    })
}
