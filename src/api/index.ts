import axios from 'axios'
import base64 from 'crypto-js/enc-base64'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import { apikey, passPhrase, secretkey } from '../funding/config'
import type {
  Balance,
  Currency,
  TransferFundParams,
  WithdrawParams,
} from '../types'

// export async function getETHPrice(): Promise<number> {
//   const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
//     params: {
//       symbol: 'ETHUSDT',
//     },
//   })
//   return Number(res.data.price)
// }

export async function getETHPrice(): Promise<number> {
  const res = await axios.get('https://min-api.cryptocompare.com/data/price', {
    params: {
      fsym: 'ETH',
      tsyms: 'USD',
    },
  })
  return res.data.USD
}

export async function getCurrencies(
  ccy = 'ETH',
  op: 'withdraw' | 'deposit'
): Promise<Currency[]> {
  const path = `/api/v5/asset/currencies?ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })

  return res.data.data.filter((currency: Currency) => {
    return (
      (op === 'withdraw' ? currency.canWd : currency.canDep) &&
      !['ETHK-OKTC', 'ETH-Starknet'].includes(currency.chain)
    )
  })
}

export async function getBalances(ccy = 'ETH'): Promise<Balance[]> {
  const path = `/api/v5/asset/balances?ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function getSubAccountBalances(
  subAcct: string,
  ccy = 'ETH'
): Promise<Balance[]> {
  const path = `/api/v5/asset/subaccount/balances?subAcct=${subAcct}&ccy=${ccy}`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(hmacSHA256(`${timestamp}GET${path}`, secretkey))
  const res = await axios.get(`https://www.okx.com${path}`, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function withdraw(data: WithdrawParams) {
  const path = `/api/v5/asset/withdrawal`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(
    hmacSHA256(`${timestamp}POST${path}${JSON.stringify(data)}`, secretkey)
  )

  const res = await axios.post(`https://www.okx.com${path}`, data, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}

export async function transferFund(data: TransferFundParams) {
  const path = `/api/v5/asset/transfer`
  const timestamp = new Date().toISOString()
  const sign = base64.stringify(
    hmacSHA256(`${timestamp}POST${path}${JSON.stringify(data)}`, secretkey)
  )

  const res = await axios.post(`https://www.okx.com${path}`, data, {
    headers: {
      'OK-ACCESS-KEY': apikey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  })
  return res.data.data
}
