import { sendTransaction } from '../utils'
import type { Address, PublicClient, WalletClient } from 'viem'

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

function getCalls(address: Address) {
  return {
    address: '0x981F198286E40F9979274E0876636E9144B8FB8E',
    abi,
    functionName: 'send_mail',
    args: [`${address}@dmail.ai`, 'dmailteam@dmail.ai'],
  } as const
}

export default {
  title: 'Dmail',
  description: '向 dmailteam@dmail.ai 发送邮件',
  value: 'dmail',
  calls: (address: Address) => getCalls(address),
  sendTransaction: (publicClient: PublicClient, walletClient: WalletClient) =>
    sendTransaction(
      publicClient,
      walletClient,
      getCalls(walletClient.account!.address)
    ),
}
