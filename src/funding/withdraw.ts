import 'dotenv/config'
import c from 'picocolors'
import prompts from 'prompts'
import { resolvedWallets } from '../configs/wallets'
import { generateWalletTitle, tokenToUSD } from '../utils'
import { getBalances, getCurrencies, getTokenPrice, withdraw } from '../api'
import type { TokenSymbol } from '../types'

async function getConfig() {
  const currencies = await getCurrencies(process.env.WITHDRAW_TOKEN, 'withdraw')
  const tokenPrice = await getTokenPrice(
    process.env.WITHDRAW_TOKEN as TokenSymbol
  )

  const {
    value: { chain, fee },
  } = await prompts({
    type: 'select',
    name: 'value',
    message: '请选择提币网络',
    choices: currencies.map((currency) => ({
      title: `${currency.chain} ${c.dim(
        `(手续费: ${currency.minFee} ${process.env.WITHDRAW_TOKEN} ${c.green(
          `≈ $${tokenToUSD(currency.minFee, tokenPrice)}`
        )})`
      )}`,
      value: {
        chain: currency.chain,
        fee: currency.minFee,
      },
    })),
  })

  const { value: address } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: '请选择接收提币的钱包',
    choices: resolvedWallets.map((wallet) => ({
      title: generateWalletTitle(wallet.address),
      value: wallet.address,
    })),
  })

  const balances = await getBalances(process.env.WITHDRAW_TOKEN)
  const minWd = currencies.find((currency) => currency.chain === chain)?.minWd
  const availBal = (
    Math.floor(Number(balances[0].availBal) * 1e8) / 1e8
  ).toFixed(8)
  const { value: amount } = await prompts({
    type: 'text',
    name: 'value',
    message: `请输入提币数量 (可用: ${c.green(
      `${availBal} ${process.env.WITHDRAW_TOKEN}`
    )})`,
    validate: (value) => {
      if (isNaN(value)) {
        return '请输入数字'
      }
      if (value < Number(minWd)) {
        return `提币数量不能小于最小提币额 ${minWd} ${process.env.WITHDRAW_TOKEN}`
      }
      if (value > Number(availBal)) {
        return `提币数量不能大于可用余额 ${availBal} ${process.env.WITHDRAW_TOKEN}`
      }
      return true
    },
  })
  return { chain, fee, address, amount, tokenPrice }
}

async function beforeSubmitTransaction(amount: string, tokenPrice: number) {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: `确认提币 ${c.green(amount)} ${process.env.WITHDRAW_TOKEN} ${c.dim(
      `(${c.green(`≈ $${tokenToUSD(amount, tokenPrice)}`)})`
    )} ?`,
    initial: true,
  })
  return value
}

async function run() {
  const { chain, fee, address, amount, tokenPrice } = await getConfig()
  const isSubmit = await beforeSubmitTransaction(amount, tokenPrice)

  if (!isSubmit) return

  const res = await withdraw({
    amt: amount,
    fee,
    dest: '4',
    ccy: process.env.WITHDRAW_TOKEN!,
    chain,
    toAddr: address,
  })

  console.log(
    `\n${c.green('✔')} ${c.bold('提币成功!')} 提币申请ID: ${res[0].wdId}`
  )
}

run()
