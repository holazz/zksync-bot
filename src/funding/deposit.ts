import 'dotenv/config'
import c from 'picocolors'
import prompts from 'prompts'
import { resolvedWallets } from '../configs/wallets'
import { ethToUsd, generateWalletTitle, getProvider } from '../utils'
import { depositConfig } from '../configs/funding'
import {
  getBalances,
  getCurrencies,
  getETHPrice,
  getSubAccountBalances,
  transferFund,
} from '../api'

async function getConfig() {
  const currencies = await getCurrencies(process.env.WITHDRAW_TOKEN, 'deposit')
  const ethPrice = await getETHPrice()

  const { value: chain } = await prompts({
    type: 'select',
    name: 'value',
    message: '请选择充币网络',
    choices: currencies.map((currency) => ({
      title: currency.chain,
      value: currency.chain,
    })),
  })

  const { value: address } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: '请选择充币钱包',
    choices: resolvedWallets.map((wallet) => ({
      title: generateWalletTitle(wallet.address),
      value: wallet.address,
    })),
  })

  const publicClient = getProvider()
  const ethBalance = await publicClient.getBalance({
    address,
  })
  console.log(Number(ethBalance) / 1e18)

  // const balances = await getBalances(process.env.WITHDRAW_TOKEN)
  // const minWd = currencies.find((currency) => currency.chain === chain)?.minWd
  // const availBal = (
  //   Math.floor(Number(balances[0].availBal) * 1e8) / 1e8
  // ).toFixed(8)
  // const { value: amount } = await prompts({
  //   type: 'text',
  //   name: 'value',
  //   message: `请输入提币数量 (可用: ${c.green(
  //     `${availBal} ${process.env.WITHDRAW_TOKEN}`
  //   )})`,
  //   validate: (value) => {
  //     if (isNaN(value)) {
  //       return '请输入数字'
  //     }
  //     if (value < Number(minWd)) {
  //       return `提币数量不能小于最小提币额 ${minWd} ${process.env.WITHDRAW_TOKEN}`
  //     }
  //     if (value > Number(availBal)) {
  //       return `提币数量不能大于可用余额 ${availBal} ${process.env.WITHDRAW_TOKEN}`
  //     }
  //     return true
  //   },
  // })
  return { chain, address }
}

async function beforeSubmitTransaction() {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: '确认提币?',
    initial: true,
  })
  return value
}

async function run() {
  // const res = await getSubAccountBalances('Rfnhetxz1', 'ETH')
  // console.log(res)
  // await transferFund({
  //   ccy: process.env.WITHDRAW_TOKEN!,
  //   type: '2',
  //   amt: '0.001',
  //   from: '6',
  //   to: '6',
  //   subAcct: 'Rfnhetxz1',
  // })
  const { chain, address } = await getConfig()
}

run()
