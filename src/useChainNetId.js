import { useConfluxJSDefined } from "./";
import { useEffectOnce } from "react-use";
import { useState } from "react";

export const UPDATE_CHAINID_SWR_ID = "UPDATE_CHAINID_SWR_ID";
export const UPDATE_NETWORKID_SWR_ID = "UPDATE_NETWORKID_SWR_ID";

export default function useChainNetId() {
  useConfluxJSDefined();

  const [chainId, setChainId] = useState(window?.conflux?.chainId);
  const [networkId, setNetworkId] = useState(parseInt(window?.conflux?.networkVersion ,10) || null);

  useEffectOnce(() => {
    const chainListener = (chainId) => {
      setChainId(chainId);
    };
    const networkListener = (networkId) => {
      setNetworkId(parseInt(networkId, 10) || null);
    };
    window?.conflux?.on("chainIdChanged", chainListener);
    window?.conflux?.on("networkChanged", networkListener);
    return () => {
      window?.conflux?.off("chainIdChanged", chainListener);
      window?.conflux?.off("networkChanged", networkListener);
    };
 })

  return {chainId, networkId}
}