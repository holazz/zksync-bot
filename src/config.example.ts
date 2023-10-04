import type { Wallet } from './types'

export const wallets: Wallet[] = [
  {
    privateKey: '0x', // 私钥
    address: '0x', // 地址
    label: '', // 备注（可选）
  },
]

export const resolvedWallets: Wallet[] = wallets.map((wallet, index) => ({
  label: `Account ${index + 1}`,
  ...wallet,
}))
