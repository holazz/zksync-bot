import 'dotenv/config'
import { Contract } from 'ethers'
import { sendTransaction } from '../utils'
import type { Wallet } from 'ethers'
import type { Hex } from '../types'

const abi = [
  {
    inputs: [
      { internalType: 'string', name: 'to', type: 'string' },
      { internalType: 'string', name: 'subject', type: 'string' },
    ],
    name: 'send_mail',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

function getCalls(address: string) {
  return {
    contract: new Contract('0x981F198286E40F9979274E0876636E9144B8FB8E', abi),
    functionName: 'send_mail',
    args: [`${address}@dmail.ai`, 'dmailteam@dmail.ai'],
  }
}

export default {
  title: 'Dmail',
  description: '向 dmailteam@dmail.ai 发送邮件',
  value: 'dmail',
  calls: (address: Hex) => getCalls(address),
  sendTransaction: (signer: Wallet) =>
    sendTransaction(signer, getCalls(signer.address)),
}
