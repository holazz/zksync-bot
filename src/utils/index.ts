import 'dotenv/config'
import { createPublicClient, createWalletClient, formatEther, http } from 'viem'
import { zkSync, zkSyncTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import c from 'picocolors'
import { resolvedWallets } from '../config'
import { getETHPrice } from '../api'
import type {
  EstimateContractGasParameters,
  Hex,
  PublicClient,
  SimulateContractParameters,
  WalletClient,
} from 'viem'

export function getClient(): PublicClient
export function getClient(privateKey?: Hex): WalletClient
export function getClient(privateKey?: Hex): PublicClient | WalletClient {
  const chain = process.env.NETWORK === 'mainnet' ? zkSync : zkSyncTestnet

  if (!privateKey) {
    return createPublicClient({
      chain,
      transport: http(),
    })
  }

  return createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain,
    transport: http(),
  })
}

export async function estimateGasFee(
  publicClient: PublicClient,
  calls: EstimateContractGasParameters
) {
  const [gas, gasPrice, ethPrice] = await Promise.all([
    publicClient.estimateContractGas(calls),
    publicClient.getGasPrice(),
    getETHPrice(),
  ])
  return Number(
    (Number(gas) * Number(formatEther(gasPrice)) * ethPrice).toFixed(2)
  )
}

export async function sendTransaction(
  publicClient: PublicClient,
  walletClient: WalletClient,
  calls: SimulateContractParameters
) {
  const nonce =
    (await publicClient.getTransactionCount({
      address: walletClient.account!.address,
    })) + 1
  const { request } = await publicClient.simulateContract({
    ...calls,
    account: walletClient.account!,
  })
  const tx = await walletClient.writeContract(request)
  return {
    address: generateWalletTitle(walletClient.account!.address),
    nonce,
    tx,
  }
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
