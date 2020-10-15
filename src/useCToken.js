import {
  useConfluxJSDefined,
  useSWR,
  useEpochNumberSWR,
  initContract,
  useConfluxPortal,
} from "./";
import abi from "./contracts/TokenBase.json";
import cuabi from "./contracts/CustodianImpl.json";
import { useEffect } from "react";

export const CTOKEN_TOTAL_SUPPLY_SWR_ID = "CTOKEN_TOTAL_SUPPLY_SWR_ID";
export const CTOKEN_BALANCE_SWR_ID = "CTOKEN_BALANCE_SWR_ID";
export const CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID =
  "CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID";
export const CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID =
  "CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID";

let c = initContract({ abi });
let cu = initContract({ abi: cuabi });

// contractAddr: ctoken address
/**
 * interact with the shuttleflow TokenBase contract, get cToken info
 * @param {Address} contractAddr TokenBase contract address
 * @param {Address} custodianContractAddr custodian contract address
 * @returns {Object} check the code below
 */
export default function useCToken(contractAddr, custodianContractAddr) {
  const confluxJSDefined = useConfluxJSDefined();

  useEffect(() => {
    if (confluxJSDefined && !c) {
      c = initContract({ abi });
      cu = initContract({ abi: cuabi });
    }
  }, [confluxJSDefined]);

  const { address: userAddr } = useConfluxPortal();

  const { data: totalSupply, totalSupplyErr } = useEpochNumberSWR(
    contractAddr ? [CTOKEN_TOTAL_SUPPLY_SWR_ID, contractAddr] : null,
    () => c?.totalSupply()?.call({ to: contractAddr })
  );

  if (totalSupplyErr)
    console.error(`Error get totalSupply: ${totalSupplyErr.message}`);

  const { data: balance, balanceErr } = useEpochNumberSWR(
    userAddr && contractAddr
      ? [CTOKEN_BALANCE_SWR_ID, contractAddr, userAddr]
      : null,
    () => c?.balanceOf(userAddr)?.call({ to: contractAddr })
  );

  if (balanceErr) console.error(`Error get balance: ${balanceErr.message}`);

  const {
    data: refTokenAddr,
    error: refTokenAddrError,
  } = useSWR(
    confluxJSDefined && custodianContractAddr && contractAddr
      ? [CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID, custodianContractAddr, contractAddr]
      : null,
    () => cu?.token_reference(contractAddr)?.call({ to: custodianContractAddr })
  );
  if (refTokenAddrError)
    console.error(`[refTokenAddrError]: ${refTokenAddrError.message}`);

  const {
    data: refTokenDecimal,
    error: refTokenDecimalError,
  } = useSWR(
    confluxJSDefined && custodianContractAddr && contractAddr
      ? [
          CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID,
          custodianContractAddr,
          contractAddr,
        ]
      : null,
    () => cu?.token_decimals(contractAddr)?.call({ to: custodianContractAddr })
  );

  if (refTokenDecimalError)
    console.error(`[refTokenDecimalError]: ${refTokenDecimalError.message}`);

  const burn = (
    amount,
    expectedFee,
    externalAddr,
    defiRelayer = "0x0000000000000000000000000000000000000000"
  ) => {
    return userAddr
      ? c
          ?.burn(userAddr, amount, expectedFee, externalAddr, defiRelayer)
          ?.sendTransaction({ from: userAddr, to: contractAddr })
      : Promise.reject("portal not installed");
  };

  return {
    totalSupply,
    balance,
    burn,
    refTokenAddr,
    refTokenDecimal,
  };
}
