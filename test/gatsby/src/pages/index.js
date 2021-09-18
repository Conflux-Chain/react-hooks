import {
  Big,
  useChainNetId,
  useConfirmationRiskByHash,
  useConfluxJSDefined,
  useConfluxPortal,
  useEpochNumber,
  useStatus,
  useClientVersion,
} from "../../../../"
import * as React from "react"
import { useMemo, useState } from "react"

// markup
const IndexPage = () => {
  const confluxJSDefined = useConfluxJSDefined()
  const status = useStatus()
  const epochNumber = useEpochNumber()
  const { chainId: cchainId, networkId: nnetworkId } = useChainNetId()
  const {
    portalInstalled,
    address,
    balances: [cfxBalance, tokenBalances],
    login,
    useEnsurePortalLogin,
    chainId,
    networkId,
  } = useConfluxPortal([
    "CFX:TYPE.CONTRACT:ACHC8NXJ7R451C223M18W2DWJNMHKD6RXAWRVKVSY2", // fc contract address
    "CFX:TYPE.CONTRACT:ACDRF821T59Y12B4GUYZCKYUW2XF1GFPJ2BA0X4SJ6", // ceth contract address
  ])
  useEnsurePortalLogin()
  const loggedIn = Boolean(address)
  const [fcBalance, cethBalance] = tokenBalances.map((b) =>
    (Big(b) / 1e18).toString()
  )
  const [resetCount, setResetCount] = useState(1)
  const currentBlockHash = useMemo(() => status?.bestHash, [
    Boolean(status?.bestHash),
    resetCount,
  ])
  const risk = useConfirmationRiskByHash(currentBlockHash)
  const clientVersion = useClientVersion()
  return (
    <main>
      <title>Home Page</title>
      Congratulations
      <p>confluxJSDefined={JSON.stringify(confluxJSDefined)}</p>
      <p>Status: {JSON.stringify(status)} CFX</p>
      <p>epochNumber: {epochNumber}</p>
      <p>cchainId: {cchainId}</p>
      <p>nnetworkId: {nnetworkId}</p>
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
      <p>block: {currentBlockHash}</p>
      <p>risk: {risk}</p>
      <button onClick={() => setResetCount((c) => c + 1)}>
        try another block
      </button>
      <p>Fullnode version: {clientVersion}</p>
    </main>
  )
}

export default IndexPage
