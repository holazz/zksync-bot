import 'dotenv/config'
import c from 'picocolors'
import prompts from 'prompts'
import { Contract, Wallet } from 'zksync-web3'
import { utils } from 'ethers'
import { resolvedWallets } from '../configs/wallets'
import {
  estimateTransferGasFee,
  generateWalletTitle,
  getProvider,
  getTokenBalance,
  getTokenDecimals,
  isNativeToken,
  tokenToUSD,
} from '../utils'
import { chains, tokens } from '../constants'
import { depositConfig } from '../configs/funding'
import { getCurrencies, getTokenPrice } from '../api'
import logger from '../utils/logger'
import type { TokenSymbol } from '../types'

function formatChain(chain: string) {
  switch (chain) {
    case 'ETH-ERC20':
    case 'USDC-ERC20':
    case 'USDT-ERC20':
      return 'ETHEREUM'
    case 'ETH-zkSync Era':
      return 'ZKSYNC_ERA'
    case 'ETH-Arbitrum One':
    case 'USDC-Arbitrum One':
    case 'USDC-Arbitrum One (Bridged)':
    case 'USDT-Arbitrum One':
      return 'ARBITRUM'
    case 'ETH-Optimism':
    case 'USDC-Optimism (Bridged)':
    case 'USDT-Optimism':
      return 'OPTIMISM'
    case 'ETH-Linea':
      return 'LINEA'
    default:
      throw new Error('Unsupported chain')
  }
}

async function getConfig() {
  const currencies = await getCurrencies(process.env.DEPOSIT_TOKEN, 'deposit')
  const chainChoices = await Promise.all(
    currencies.map(async (currency) => {
      const formatedChain = formatChain(currency.chain)
      const provider = getProvider(chains[formatedChain])
      const tokenAddress =
        tokens[currency.chain.split('-')[0] as TokenSymbol][formatedChain]
      const { gasFeeETH, gasFeeUSD } = await estimateTransferGasFee(
        provider,
        tokenAddress,
      )
      return {
        title: `${currency.chain} ${c.dim(
          `(手续费: ${gasFeeETH.toFixed(4)} ETH ${c.green(`≈ $${gasFeeUSD}`)})`,
        )}`,
        value: {
          provider,
          chain: formatedChain,
          tokenAddress,
        },
      }
    }),
  )

  const {
    value: { provider, chain, tokenAddress },
  } = await prompts({
    type: 'select',
    name: 'value',
    message: '请选择充币网络',
    choices: chainChoices,
  })

  const { value: wallet } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: '请选择充币钱包',
    choices: resolvedWallets.map((wallet) => ({
      title: generateWalletTitle(wallet.address),
      value: wallet,
    })),
  })

  const signer = new Wallet(wallet.privateKey, provider)
  const tokenBalance = await getTokenBalance(
    provider,
    tokenAddress,
    signer.address,
  )
  const tokenDecimals = await getTokenDecimals(signer, tokenAddress)
  const balance = Number(
    utils.formatUnits(tokenBalance, tokenDecimals),
  ).toFixed(8)
  const minDep = currencies.find(
    (currency) => formatChain(currency.chain) === chain,
  )?.minDep

  const { value: amount } = await prompts({
    type: 'text',
    name: 'value',
    message: `请输入充币数量 (可用: ${c.green(
      `${balance} ${process.env.DEPOSIT_TOKEN}`,
    )})`,
    validate: (value) => {
      if (isNaN(value)) {
        return '请输入数字'
      }
      if (value < Number(minDep)) {
        return `充币数量不能小于最小充币额 ${minDep} ${process.env.DEPOSIT_TOKEN}`
      }
      if (value > Number(balance)) {
        return `充币数量不能大于可用余额 ${balance} ${process.env.DEPOSIT_TOKEN}`
      }
      return true
    },
  })
  return { signer, tokenAddress, tokenDecimals, amount }
}

async function beforeSubmitTransaction(amount: string, tokenPrice: number) {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: `确认充币 ${c.green(amount)} ${process.env.DEPOSIT_TOKEN} ${c.dim(
      `(${c.green(`≈ $${tokenToUSD(amount, tokenPrice)}`)})`,
    )} ?`,
    initial: true,
  })
  return value
}

async function run() {
  const { signer, tokenAddress, tokenDecimals, amount } = await getConfig()
  const tokenPrice = await getTokenPrice(
    process.env.DEPOSIT_TOKEN as TokenSymbol,
  )
  const isSubmit = await beforeSubmitTransaction(amount, tokenPrice)

  if (!isSubmit) return

  const depositAddress = depositConfig.find(
    (config) => config.wallet.toLowerCase() === signer.address.toLowerCase(),
  )?.okx

  if (!depositAddress) {
    logger.error(signer.address, `未找到对应的充币地址`)
    return
  }

  const tx = isNativeToken(tokenAddress)
    ? await signer.sendTransaction({
        to: depositAddress,
        value: utils.parseEther(amount),
      })
    : await new Contract(
        tokenAddress,
        ['function transfer(address to, uint256 amount)'],
        signer,
      ).transfer(depositAddress, utils.parseUnits(amount, tokenDecimals))

  console.log(`\n${c.green('✔')} ${c.bold('充币成功!')} tx: ${tx.hash}`)
}

run()
