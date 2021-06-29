import SINGLE_CALL_BALANCES_ABI from "./contracts/cfx-single-call-balance-checker-abi.json";
import { useEffect } from "react";
import { useConfluxJSDefined, useEpochNumberSWR } from "./";
import initContract from "./initContract";

export const UPDATE_USER_BALANCE_SWR_ID = "UPDATE_USER_BALANCE_SWR_ID";

let CONTRACT_INITIATED_WITH_CFX_INSTANCE = Boolean(window?.confluxJS)

let c = initContract({
  abi: SINGLE_CALL_BALANCES_ABI,
  address: "0x8f35930629fce5b5cf4cd762e71006045bfeb24d",
}, window?.confluxJS);

function getTokensBalance(userAddr, tokenAddrs) {
  return c
    ?.balances(
      [userAddr],
      ["0x0000000000000000000000000000000000000000", ...tokenAddrs]
    )
    ?.call();
}

export default function useBalance(userAddr, tokenAddrs) {
  const confluxJSDefined = useConfluxJSDefined();
  useEffect(() => {
    if (!confluxJSDefined) return
    if (c) {
      if (!CONTRACT_INITIATED_WITH_CFX_INSTANCE) {
        c._feedAddressNetId(SINGLE_CALL_BALANCES_ABI, window.confluxJS)
        CONTRACT_INITIATED_WITH_CFX_INSTANCE = true
      }
    } else {
      c = initContract({
        abi: SINGLE_CALL_BALANCES_ABI,
        address: "0x8f35930629fce5b5cf4cd762e71006045bfeb24d",
      }, window.confluxJS);
      CONTRACT_INITIATED_WITH_CFX_INSTANCE = true
    }
  }, [confluxJSDefined]);

  const {
    data: [balance, ...tokenBalances],
    error: balanceErr,
  } = useEpochNumberSWR(
    userAddr
      ? [UPDATE_USER_BALANCE_SWR_ID, userAddr, tokenAddrs.toString()]
      : null,
    () => getTokensBalance(userAddr, tokenAddrs),
    { initialData: [0, ...tokenAddrs.map(() => 0)], revalidateOnMount: true }
  );

  if (balanceErr) console.error(`Get Balance Error: ${balanceErr.message}`);

  return [balance, tokenBalances];
}
