import 'dotenv/config'
import { Contract } from 'zksync-web3'
import { estimateGasFee, sendTransaction } from '../../utils'
import ABI from '../../abi/common/erc20-approval.json'
import items from './items'
import type { Wallet } from 'zksync-web3'

function getCalls(contractAddress: string, signer: Wallet) {
  return {
    contract: new Contract(contractAddress, ABI),
    functionName: 'approve',
    args: [signer.address, 0],
  }
}

export default items.map((item) => ({
  title: item.title,
  description: '授权代币',
  value: item.value,
  estimateGasFee: (signer: Wallet) =>
    estimateGasFee(signer, getCalls(item.contractAddress, signer)),
  sendTransaction: (signer: Wallet) =>
    sendTransaction(signer, getCalls(item.contractAddress, signer)),
}))
