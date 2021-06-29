import React, { useMemo, useState } from "react"
import {
  useStatus,
  useEpochNumber,
  useConfluxPortal,
  useBalance,
  useChainNetId,
  useConfirmationRiskByHash,
  useClientVersion,
  Big,
} from "../src"
import ConfluxJSDefinedUI from "./ConfluxJSDefinedUI"

export default {
  title: "General",
}

const UseConfluxPortalTemplate = () => {
  const {
    portalInstalled,
    address,
    balances: [cfxBalance, tokenBalances],
    login,
    useEnsurePortalLogin,
    chainId, networkId,
  } = useConfluxPortal([
    "CFX:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXAWRVKVSY2", // fc contract address
    "CFX:TYPE.CONTRACT:ACDRF821T59Y12B4GUYZCKYUW2XF1GFPJ2BA0X4SJ6", // ceth contract address
  ])

  useEnsurePortalLogin()
  const loggedIn = Boolean(address)
  const [fcBalance, cethBalance] = tokenBalances.map((b) =>
    (Big(b) / 1e18).toString()
  )

  return (
    <>
      <p>portalInstalled: {portalInstalled.toString()}</p>
      <p>chainId: {chainId}</p>
      <p>networkId: {networkId}</p>
      <p>address: {address}</p>
      <p>CFX balance: {(Big(cfxBalance) / 1e18).toString()} CFX</p>
      <div>
        token balances:
        <p> FC: {fcBalance} FC</p>
        <p> CETH: {cethBalance} CETH</p>
      </div>
      <button disabled={loggedIn || !portalInstalled} onClick={login}>
        {portalInstalled
          ? loggedIn
            ? "Already logged in"
            : "login into portal"
          : "Portal not installed"}
      </button>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseConfluxPortal = UseConfluxPortalTemplate.bind({})

const UseChainNetIdTemplate = () => {
  const {
    chainId, networkId,
  } = useChainNetId()

  return (
    <>
      <p>chainId: {chainId}</p>
      <p>networkId: {networkId}</p>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseChainNetId = UseChainNetIdTemplate.bind({})

const UseEpochNumberTemplate = () => {
  const epochNumber = useEpochNumber()

  return (
    <>
      <p>epochNumber: {epochNumber}</p>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseEpochNumber = UseEpochNumberTemplate.bind({})

const UseBalanceTemplate = () => {
  const userAddr = "CFX:TYPE.USER:AAKAFCMM3E2BWJMFYCJE5N0Z6JKXGEM1JUDWDH32JZ"
  const tokenAddrs = [
    "CFX:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXAWRVKVSY2", // fc contract address
    "CFX:TYPE.CONTRACT:ACDRF821T59Y12B4GUYZCKYUW2XF1GFPJ2BA0X4SJ6", // ceth contract address
  ]
  const [balance, [fcBalance, cethBalance]] = useBalance(userAddr, tokenAddrs)

  return (
    <>
      <p>CFX Balance: {(Big(balance) / 1e18).toString()} CFX</p>
      <p>FC Balance: {(Big(fcBalance) / 1e18).toString()} FC</p>
      <p>cETH Balance: {(Big(cethBalance) / 1e18).toString()} cETH</p>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseBalance = UseBalanceTemplate.bind({})

const UseStatusTemplate = () => {
  const status = useStatus()

  return (
    <>
      <p>Status: {JSON.stringify(status)} CFX</p>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseStatus = UseStatusTemplate.bind({})

const UseConfirmationRiskTemplate = () => {
  const [resetCount, setResetCount] = useState(1)
  const status = useStatus()
  const currentBlockHash = useMemo(() => status?.bestHash, [
    Boolean(status?.bestHash),
    resetCount,
  ])
  const risk = useConfirmationRiskByHash(currentBlockHash)

  return (
    <>
      <p>block: {currentBlockHash}</p>
      <p>risk: {risk}</p>
      <button onClick={() => setResetCount((c) => c + 1)}>
        try another block
      </button>
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseConfirmationRisk = UseConfirmationRiskTemplate.bind({})

const UseClientVersionTemplate = () => {
  console.log(useClientVersion())
  const clientVersion = useClientVersion()

  return (
    <>
      <p>Fullnode version: {clientVersion}</p>
      <br />
      <ConfluxJSDefinedUI />
    </>
  )
}

export const UseClientVersion = UseClientVersionTemplate.bind({})
