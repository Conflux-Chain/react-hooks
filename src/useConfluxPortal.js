import { useState, useEffect } from "react";
import SINGLE_CALL_BALANCES_ABI from "./contracts/cfx-single-call-balance-checker-abi.json";
import { useDebounce } from "react-use";
import useSWR from "./swr";
import useEpochNumber from "./useEpochNumber";
import initContract from "./initContract";

const UPDATE_CHAINID_SWR_ID = "UPDATE_CHAINID_SWR_ID";

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

function getTokensBalance(address, tokenAddresses) {
  return singleCallBalanceContract
    .balances(
      [address],
      ["0x0000000000000000000000000000000000000000", ...tokenAddresses]
    )
    .call();
}

export function wrapIsPortalInstalled(installed, notInstalled) {
  if (window.conflux && window.conflux.isConfluxPortal) {
    return installed;
  } else {
    return () => notInstalled;
  }
}

function useConfluxPortal(tokenAddresses = []) {
  window.conflux.autoRefreshOnNetworkChange = false;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [address, setAddress] = useState(window.conflux.selectedAddress);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chainId, setChainId] = useState(window.conflux.chainId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: swrChainId } = useSWR(UPDATE_CHAINID_SWR_ID, async () =>
    window.conflux.chainId === "loading" ? null : window.conflux.chainId
  );

  if (swrChainId !== chainId) setChainId(swrChainId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [[balance, ...tokenBalances], setTokensBalance] = useState([0, []]);

  const login = () => {
    if (!address) {
      window.conflux
        .enable()
        .then(
          (addresses) => validAddresses(addresses) && setAddress(addresses[0])
        );
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [epochNumber] = useEpochNumber();

  const useEnsurePortalLogin = () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebounce(login, 400, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (address && singleCallBalanceContract) {
      getTokensBalance(address, tokenAddresses).then(setTokensBalance);
    }
  }, [address, JSON.stringify(tokenAddresses), epochNumber]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
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
    window.conflux.on("accountsChanged", accountListener);
    window.conflux.on("networkChanged", networkListener);
    return () => {
      if (window.conflux) {
        window.conflux.off("accountsChanged", accountListener);
        window.conflux.off("networkChanged", networkListener);
      }
    };
  }, []);

  return {
    portalInstalled: true,
    address,
    balances: [balance, tokenBalances],
    chainId,
    login,
    useEnsurePortalLogin,
    conflux: window.conflux,
    confluxJS: window.confluxJS,
  };
}

useConfluxPortal.openHomePage = openHomePage;

export default wrapIsPortalInstalled(useConfluxPortal, {
  portalInstalled: false,
  address: "",
  balances: [0, []],
  chainId: "loading",
  login: () => {},
  useEnsurePortalLogin: () => {},
  conflux: {},
  confluxJS: {},
});
