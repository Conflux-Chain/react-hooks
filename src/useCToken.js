import { useState, useEffect } from "react";
import {
  useEpochNumber,
  initContract,
  wrapIsPortalInstalled,
  useConfluxPortal,
} from "../";
import abi from "./contracts/TokenBase.json";
import cuabi from "./contracts/CustodianImpl.json";
import useSWR from "./swr";

const c = initContract({ abi });
const cu = initContract({ abi: cuabi });

// contractAddr: ctoken address
function useCToken(contractAddr, custodianContractAddr) {
  const { address: userAddr } = useConfluxPortal();
  const [epochNumber] = useEpochNumber();
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (contractAddr)
      c.totalSupply().call({ to: contractAddr }).then(setTotalSupply);
  }, [contractAddr, epochNumber]);

  useEffect(() => {
    if (userAddr)
      c.balanceOf(userAddr).call({ to: contractAddr }).then(setBalance);
  }, [userAddr, contractAddr, epochNumber]);

  const {
    data: refTokenAddr,
    error: refTokenAddrError,
  } = useSWR(
    custodianContractAddr && contractAddr
      ? `${custodianContractAddr}-token_reference-${contractAddr}`
      : null,
    () => cu.token_reference(contractAddr).call({ to: custodianContractAddr })
  );
  if (refTokenAddrError)
    console.error(`[refTokenAddrError]: ${refTokenAddrError?.message}`);

  const {
    data: refTokenDecimal,
    error: refTokenDecimalError,
  } = useSWR(
    custodianContractAddr && contractAddr
      ? `${custodianContractAddr}-token_decimals-${contractAddr}`
      : null,
    () => cu.token_decimals(contractAddr).call({ to: custodianContractAddr })
  );

  if (refTokenDecimalError)
    console.error(`[refTokenDecimalError]: ${refTokenDecimalError?.message}`);

  const burn = (
    amount,
    expectedFee,
    externalAddr,
    defiRelayer = "0x0000000000000000000000000000000000000000"
  ) => {
    return c
      .burn(userAddr, amount, expectedFee, externalAddr, defiRelayer)
      .sendTransaction({ from: userAddr, to: contractAddr });
  };

  return {
    totalSupply,
    balance,
    burn,
    refTokenAddr,
    refTokenDecimal,
  };
}

export default wrapIsPortalInstalled(useCToken, {
  totalSupply: 0,
  balance: 0,
  refTokenAddr: "",
  refTokenDecimal: 0,
  burn: () => {},
});
