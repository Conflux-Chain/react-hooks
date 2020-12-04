import { useState } from "react";
import { useEffectOnce } from "react-use";
import { useConfluxJSDefined, useSWR } from "./";
import { useBalance } from "./";

export const UPDATE_CHAINID_SWR_ID = "UPDATE_CHAINID_SWR_ID";

function openHomePage() {
  window.open("https://portal.conflux-chain.org");
}

function validAddresses(addresses) {
  return Array.isArray(addresses) && addresses.length;
}

const isPortalInstalled = () => window?.conflux?.isConfluxPortal;

export default function useConfluxPortal(tokenAddrs = []) {
  useConfluxJSDefined();

  // prevent portal auto refresh when user changes the network
  if (window && window.conflux && window.conflux.autoRefreshOnNetworkChange)
    window.conflux.autoRefreshOnNetworkChange = false;

  if (
    !window.conflux &&
    window.localStorage.getItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE")
  )
    window.localStorage.removeItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE");

  const [address, setAddress] = useState(
    // NOTE: if portal is installed, there must be window.conflux here
    window.conflux
      ? window.localStorage.getItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE") ||
          undefined
      : null
  );
  const [chainId, setChainId] = useState(window?.conflux?.chainId);

  useEffectOnce(() => {
    window?.conflux?.send({ method: "cfx_accounts" }).then((accounts) => {
      if (validAddresses(accounts)) {
        setAddress(accounts[0]);
        window.localStorage.setItem(
          "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE",
          accounts[0]
        );
      } else {
        window.localStorage.removeItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE");
        setAddress(null);
      }
    });
  });

  const { data: swrChainId } = useSWR(UPDATE_CHAINID_SWR_ID, async () =>
    window?.conflux?.chainId === "loading" ? null : window?.conflux?.chainId
  );

  if (swrChainId !== chainId) setChainId(swrChainId);

  const login = (fallbackFn) => {
    if (!address) {
      if (window?.conflux?.enable)
        return window.conflux
          .enable()
          .then(
            (addresses) => validAddresses(addresses) && setAddress(addresses[0])
          );
      return typeof fallbackFn === "function" && fallbackFn();
    }
  };

  const useEnsurePortalLogin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffectOnce(login);
  };

  const [balance, tokenBalances] = useBalance(address, tokenAddrs);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => {
    const accountListener = (newAccounts) => {
      if (validAddresses(newAccounts)) {
        window.localStorage.setItem(
          "CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE",
          newAccounts[0]
        );
        setAddress(newAccounts[0]);
      } else {
        if (address !== null) setAddress(null);
        window.localStorage.removeItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE");
      }
    };
    const networkListener = (chainId) => {
      setChainId(chainId);
    };
    window?.conflux?.on("accountsChanged", accountListener);
    window?.conflux?.on("networkChanged", networkListener);
    return () => {
      window?.conflux?.off("accountsChanged", accountListener);
      window?.conflux?.off("networkChanged", networkListener);
    };
  });

  return {
    portalInstalled: Boolean(isPortalInstalled()),
    address,
    balances: [balance, tokenBalances],
    chainId,
    login,
    useEnsurePortalLogin,
    conflux: window?.conflux,
    confluxJS: window?.confluxJS,
  };
}

useConfluxPortal.openHomePage = openHomePage;
