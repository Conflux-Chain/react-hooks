import { useState, useEffect, useMemo } from "react";
import {
  useEpochNumber,
  initContract,
  wrapIsPortalInstalled,
  useConfluxPortal,
} from "../";
import abi from "./contracts/TokenBase.json";
import cuabi from "./contracts/CustodianImpl.json";
import useSWR from "./swr";

const cu = initContract({ abi: cuabi });

// contractAddress: ctoken address
function useCToken(contractAddress, custodianContractAddress) {
  const c = initContract({ abi });
  c.address = contractAddress;
  const { address: userAddress } = useConfluxPortal();
  const [epochNumber] = useEpochNumber();
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (contractAddress)
      c.totalSupply().call({ to: contractAddress }).then(setTotalSupply);
  }, [contractAddress, epochNumber]);

  useEffect(() => {
    if (userAddress)
      c.balanceOf(userAddress).call({ to: contractAddress }).then(setBalance);
  }, [userAddress, contractAddress, epochNumber]);

  const {
    data: refTokenAddress,
    error: refTokenAddressError,
  } = useSWR(
    custodianContractAddress && contractAddress
      ? `${custodianContractAddress}-token_reference-${contractAddress}`
      : null,
    () =>
      cu.token_reference(contractAddress).call({ to: custodianContractAddress })
  );
  if (refTokenAddressError)
    console.error(`[refTokenAddressError]: ${refTokenAddressError?.message}`);

  const {
    data: refTokenDecimal,
    error: refTokenDecimalError,
  } = useSWR(
    custodianContractAddress && contractAddress
      ? `${custodianContractAddress}-token_decimals-${contractAddress}`
      : null,
    () =>
      cu.token_decimals(contractAddress).call({ to: custodianContractAddress })
  );

  if (refTokenDecimalError)
    console.error(`[refTokenDecimalError]: ${refTokenDecimalError?.message}`);

  return {
    totalSupply,
    balance,
    burn: c.burn,
    refTokenAddress,
    refTokenDecimal,
  };
}

export default wrapIsPortalInstalled(useCToken, {
  totalSupply: 0,
  balance: 0,
  refTokenAddress: "",
  refTokenDecimal: 0,
  burn: () => {},
});
