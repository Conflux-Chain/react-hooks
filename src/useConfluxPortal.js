import { useState } from "react";
import SINGLE_CALL_BALANCES_ABI from "./contracts/cfx-single-call-balance-checker-abi.json";
import { useEffectOnce } from "react-use";
import { useConfluxJSDefined, useSWR, useEpochNumberSWR } from "./";
import initContract from "./initContract";

export const UPDATE_CHAINID_SWR_ID = "UPDATE_CHAINID_SWR_ID";
export const UPDATE_USER_BALANCE_SWR_ID = "UPDATE_USER_BALANCE_SWR_ID";

function openHomePage() {
  window.open("https://portal.conflux-chain.org");
}

function validAddresses(addresses) {
  return Array.isArray(addresses) && addresses.length;
}

const singleCallBalanceContract = initContract({
  abi: SINGLE_CALL_BALANCES_ABI,
  address: "0x8f35930629fce5b5cf4cd762e71006045bfeb24d",
});

function getTokensBalance(address, tokenAddr) {
  return singleCallBalanceContract
    ?.balances(
      [address],
      ["0x0000000000000000000000000000000000000000", ...tokenAddr]
    )
    ?.call();
}

const isPortalInstalled = () => window?.conflux?.isConfluxPortal;

export default function useConfluxPortal(tokenAddr = []) {
  useConfluxJSDefined();

  // prevent portal auto refresh when user changes the network
  if (window && window.conflux && window.conflux.autoRefreshOnNetworkChange)
    window.conflux.autoRefreshOnNetworkChange = false;

  const [address, setAddress] = useState(window?.conflux?.selectedAddress);
  const [chainId, setChainId] = useState(window?.conflux?.chainId);

  const { data: swrChainId } = useSWR(UPDATE_CHAINID_SWR_ID, async () =>
    window?.conflux?.chainId === "loading" ? null : window?.conflux?.chainId
  );

  if (swrChainId !== chainId) setChainId(swrChainId);

  const login = () => {
    if (!address) {
      window?.conflux
        ?.enable()
        ?.then(
          (addresses) => validAddresses(addresses) && setAddress(addresses[0])
        );
    }
  };

  const useEnsurePortalLogin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffectOnce(login);
  };

  const {
    data: [balance, ...tokenBalances],
    error: balanceErr,
  } = useEpochNumberSWR(
    address && singleCallBalanceContract
      ? [UPDATE_USER_BALANCE_SWR_ID, address, tokenAddr.toString()]
      : null,
    () => getTokensBalance(address, tokenAddr),
    { initialData: [0, ...tokenAddr.map(() => 0)] }
  );

  if (balanceErr) console.error(`Get Balance Error: ${balanceErr.message}`);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => {
    const accountListener = (newAccounts) => {
      if (validAddresses(newAccounts)) {
        setAddress(newAccounts[0]);
      } else {
        setAddress(null);
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
