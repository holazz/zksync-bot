import fs from 'node:fs'
import fsp from 'node:fs/promises'
import c from 'picocolors'
import prompts from 'prompts'
import { Wallet } from 'zksync-web3'
import { csv2json, json2csv } from 'json-2-csv'
import {
  generateWalletTitle,
  getLatestTransactionAge,
  getProvider,
} from '../utils'
import { resolvedWallets } from '../configs/wallets'
import modules from '../modules'
import type { WalletConfig } from '../types'

interface Data extends WalletConfig {
  total: number
  [key: string]: any
}

async function generateData() {
  let records: Data[] = []
  if (fs.existsSync('records.csv')) {
    const csv = await fsp.readFile('records.csv', 'utf-8')
    records = (await csv2json(csv)) as Data[]
  }
  const data = resolvedWallets.map((wallet) => {
    const projects = modules.reduce(
      (acc, cur) => {
        return {
          ...acc,
          [cur.value]:
            records.find((d) => d.address === wallet.address)?.[cur.value] || 0,
        }
      },
      {} as Record<string, number>,
    )
    return {
      ...wallet,
      ...projects,
      total: Object.values(projects).reduce((acc, cur) => acc + cur, 0),
    }
  })
  return data
}

function processData(data: Data) {
  const getRandomEdge = (type: 'max' | 'min') => {
    const count = Math[type](...modules.map((s) => data[s.value]))
    const filteredSource = modules.filter((s) => data[s.value] === count)
    return filteredSource[Math.floor(Math.random() * filteredSource.length)]
  }
  const [max, min] = [getRandomEdge('max'), getRandomEdge('min')]
  const filteredModules = modules.filter(
    (m) => m.value !== max.value && m.value !== min.value,
  )
  const randomModule = filteredModules.sort(() => Math.random() - 0.5)[0]
  return [data, randomModule.value] as [Data, string]
}

async function filterData(data: Data[]) {
  let filteredData: Data[] = []

  if (data.length - 2 < Number(process.env.ACCOUNT)) {
    filteredData = data
      .sort(() => Math.random() - 0.5)
      .slice(0, Number(process.env.ACCOUNT))
  } else {
    const getRandomEdge = (type: 'max' | 'min') => {
      const count = Math[type](...data.map((d) => d.total))
      const filteredSource = data.filter((d) => d.total === count)
      return filteredSource[Math.floor(Math.random() * filteredSource.length)]
    }

    filteredData = data
      .filter((d) => {
        const [max, min] = [getRandomEdge('max'), getRandomEdge('min')]
        return d.address !== max.address && d.address !== min.address
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, Number(process.env.ACCOUNT))
  }

  return filteredData.map((wallet) => processData(wallet))
}

async function beforeSubmitTransaction(filteredData: [Data, string][]) {
  const promises = filteredData.map(async ([data, project]) => {
    const provider = getProvider()
    const signer = new Wallet(data.privateKey, provider)
    const module = modules.find((m) => m.value === project)!
    const fee = await module.estimateGasFee(signer)
    const age = await getLatestTransactionAge(data.address)

    return {
      address: data.address,
      project,
      fee,
      age,
      sendTransaction: () => module.sendTransaction(signer),
    }
  })
  const res = await Promise.all(promises)
  let message = ''
  res.forEach((r) => {
    message += `\n${c.bold(generateWalletTitle(r.address))} ${c.dim(
      '›',
    )} ${c.bold(r.project)} ${c.dim(
      `(${modules.find((m) => m.value === r.project)?.description})`,
    )} ${c.dim('›')} ${c.yellow(`$${r.fee}`)} ${c.dim('›')} ${r.age}`
  })
  message += `\n\n${c.bold('预估手续费合计:')} ${c.yellow(
    `$${res.reduce((acc, cur) => acc + cur.fee, 0).toFixed(2)}`,
  )}`

  if (process.env.TRANSACTION_CONFIRM === 'true') {
    const { value } = await prompts({
      type: 'confirm',
      name: 'value',
      message: `${message}, 确认交易吗?`,
      initial: true,
    })
    return {
      submitInfo: res,
      isSubmit: value,
    }
  }
  console.log(message)
  return {
    submitInfo: res,
    isSubmit: true,
  }
}

function updateRecords(data: Data[], filteredData: [Data, string][]) {
  const records = data.map((d) => {
    const filtered = filteredData.find((f) => f[0].address === d.address)!
    if (!filtered) return d
    return {
      ...d,
      [filtered[1]]: d[filtered[1]] + 1,
      total: d.total + 1,
    }
  })
  return records
}

export async function run() {
  const data = await generateData()
  const filteredData = await filterData(data)
  const { submitInfo, isSubmit } = await beforeSubmitTransaction(filteredData)
  if (!isSubmit) return

  const promises = submitInfo.map((info) => info.sendTransaction())
  const res = await Promise.all(promises)

  res.flat().forEach((r) => {
    console.log(
      `\n${c.bold(generateWalletTitle(r.address))}\n${c.bold(
        'Nonce: ',
      )}${c.yellow(r.nonce.toString())}\n${c.bold('Transaction: ')}${c.green(
        `${
          process.env.NETWORK === 'mainnet'
            ? 'https://explorer.zksync.io/tx/'
            : 'https://goerli.explorer.zksync.io/tx/'
        }${r.tx}`,
      )}\n`,
    )
  })

  const records = updateRecords(data, filteredData)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const csv = await json2csv(records.map(({ privateKey, ...rest }) => rest))
  await fsp.writeFile('records.csv', csv)
}
