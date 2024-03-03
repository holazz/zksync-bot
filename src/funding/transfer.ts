import 'dotenv/config'
import { getSubAccountBalances, transferFund } from '../api'

const subAccounts = ['Rfnhetxz1', 'Rfnhetxz2', 'Rfnhetxz3']

const subAccountsInfo = await Promise.all(
  subAccounts.map((account) => getSubAccountBalances(account, 'ETH')),
)

const availableAccounts = subAccountsInfo
  .map((item, index) => {
    return {
      ...item[0],
      name: `Rfnhetxz${index + 1}`,
    }
  })
  .filter((item) => Number(item.availBal) > 0)

console.log(availableAccounts)

const transferPromises = availableAccounts.map((account) => {
  return transferFund({
    ccy: process.env.WITHDRAW_TOKEN!,
    type: '2',
    amt: account.availBal,
    from: '6',
    to: '6',
    subAcct: account.name,
  })
})

const res = await Promise.all(transferPromises)
console.log(res)
