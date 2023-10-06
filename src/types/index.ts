import type { Contract } from 'ethers'

export type Hex = `0x${string}`

export interface WalletConfig {
  privateKey: Hex
  address: Hex
  label?: string
}

export interface Calls {
  contract: Contract
  functionName: string
  args: any[]
}

export interface Currency {
  canDep: boolean
  canInternal: boolean
  canWd: boolean
  ccy: string
  chain: string
  depQuotaFixed: string
  depQuoteDailyLayer2: string
  logoLink: string
  mainNet: boolean
  maxFee: string
  maxFeeForCtAddr: string
  maxWd: string
  minDep: string
  minDepArrivalConfirm: string
  minFee: string
  minFeeForCtAddr: string
  minWd: string
  minWdUnlockConfirm: string
  name: string
  needTag: boolean
  usedDepQuotaFixed: string
  usedWdQuota: string
  wdQuota: string
  wdTickSz: string
}

export interface Balance {
  availBal: string
  bal: string
  ccy: string
  frozenBal: string
}

export interface WithdrawParams {
  amt: string
  fee: string
  dest: '3' | '4' // 3: 内部转账 4: 链上提币
  ccy: string
  chain: string
  toAddr: string
}

export interface TransferFundParams {
  ccy: string
  type: '0' | '2' // 0: 账户内划转 2: 子账户转母账户
  amt: string
  from: '6' | '18' // 6: 资金账户 18: 交易账户
  to: '6' | '18'
  subAcct?: string
}
