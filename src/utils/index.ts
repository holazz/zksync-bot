import 'dotenv/config'
import { utils } from 'ethers'
import { Contract, Provider } from 'zksync-web3'
import c from 'picocolors'
import { resolvedWallets } from '../configs/wallets'
import { getTokenPrice } from '../api'
import type { BigNumber } from 'ethers'
import type { Wallet } from 'zksync-web3'
import type { Calls } from '../types'

export function getProvider() {
  return new Provider(
    process.env.NETWORK === 'mainnet'
      ? 'https://mainnet.era.zksync.io'
      : 'https://testnet.era.zksync.dev'
  )
}

export function getTokenDecimals(contractAddress: string): Promise<number> {
  const provider = getProvider()
  const contract = new Contract(
    contractAddress,
    ['function decimals() view returns (uint8)'],
    provider
  )
  return contract.decimals()
}

export async function approveToken(
  signer: Wallet,
  tokenAddress: string,
  spender: string,
  amount: BigNumber
) {
  const contract = new Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount)'],
    signer
  )
  const tx = await contract.approve(spender, amount)
  return tx.wait()
}

export async function estimateGasFee(signer: Wallet, calls: Calls) {
  const { contract, functionName, args, options } = calls
  const [gas, gasPrice, ethPrice] = await Promise.all([
    signer.estimateGas({
      to: contract.address,
      data: contract.interface.encodeFunctionData(functionName, args),
      ...options,
    }),
    signer.getGasPrice(),
    getTokenPrice('ETH'),
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

export function tokenToUSD(amount: number | string, tokenPrice: number) {
  return Number((Number(amount) * tokenPrice).toFixed(2))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function generateWalletTitle(address: string) {
  const wallet = resolvedWallets.find(
    (w) => w.address.toLowerCase() === address.toLowerCase()
  )!
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
