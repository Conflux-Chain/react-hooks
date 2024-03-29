import { useState } from "react"
import { useEffectOnce } from "react-use"
import { useConfluxJSDefined, useSWR } from "./"
import { useBalance } from "./"
import { useChainNetId } from "./"
import { onBrowser } from "./ssr-helper.js"

function openHomePage() {
  window.open("https://portal.confluxnetwork.org")
}

function validAddresses(addresses) {
  return Array.isArray(addresses) && addresses.length
}

const isPortalInstalled = () => window?.conflux?.isConfluxPortal

const useConfluxPortal = (tokenAddrs = []) =>
  onBrowser(
    () => {
      useConfluxJSDefined()

      // prevent portal auto refresh when user changes the network
      if (window && window.conflux && window.conflux.autoRefreshOnNetworkChange)
        window.conflux.autoRefreshOnNetworkChange = false

      if (
        !window.conflux &&
        window.localStorage.getItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE")
      )
        window.localStorage.removeItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE")

      const [address, setAddress] = useState(
        // NOTE: if portal is installed, there must be window.conflux here
        window.conflux
          ? window.localStorage.getItem(
              "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE"
            ) || undefined
          : null
      )

      const { chainId, networkId } = useChainNetId()
      const [error, setError] = useState(null)

      useEffectOnce(() => {
        window?.conflux?.send({ method: "cfx_accounts" }).then((accounts) => {
          if (validAddresses(accounts)) {
            setAddress(accounts[0])
            window.localStorage.setItem(
              "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE",
              accounts[0]
            )
          } else {
            window.localStorage.removeItem(
              "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE"
            )
            setAddress(null)
          }
        })
      })

      const login = async (fallbackFn) => {
        if (!window?.conflux) return
        const hasAddr =
          !!address && (await window.conflux.send("cfx_accounts")).length
        if (hasAddr)
          return typeof fallbackFn === "function" ? fallbackFn() : undefined
        return window.conflux
          .send("cfx_requestAccounts")
          .then(
            (addresses) => validAddresses(addresses) && setAddress(addresses[0])
          )
          .catch((error) => setError(error))
        return typeof fallbackFn === "function" && fallbackFn()
      }

      const useEnsurePortalLogin = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffectOnce(login)
      }

      const [balance, tokenBalances] = useBalance(address, tokenAddrs)

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffectOnce(() => {
        const accountListener = (newAccounts) => {
          if (validAddresses(newAccounts)) {
            window.localStorage.setItem(
              "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE",
              newAccounts[0]
            )
            setAddress(newAccounts[0])
          } else {
            if (address !== null) setAddress(null)
            window.localStorage.removeItem(
              "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE"
            )
          }
        }
        window?.conflux?.on("accountsChanged", accountListener)
        return () => {
          window?.conflux?.off("accountsChanged", accountListener)
        }
      })

      return {
        portalInstalled: Boolean(isPortalInstalled()),
        address,
        balances: [balance, tokenBalances],
        networkId,
        chainId,
        error,
        login,
        useEnsurePortalLogin,
        conflux: window?.conflux,
        confluxJS: window?.confluxJS,
      }
    },
    () => ({
      portalInstalled: false,
      address: null,
      balances: [0, []],
      networkId: undefined,
      chainId: undefined,
      error: undefined,
      login: () => {},
      useEnsurePortalLogin: () => {},
      conflux: undefined,
      confluxJS: undefined,
    })
  )
useConfluxPortal.openHomePage = openHomePage
export default useConfluxPortal
