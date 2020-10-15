import { initContract, wrapIsPortalInstalled, useConfluxPortal } from "../";
import abi from "./contracts/TokenBase.json";
import cuabi from "./contracts/CustodianImpl.json";
import useSWR, { useEpochNumberSWR } from "./swr";

export const CTOKEN_TOTAL_SUPPLY_SWR_ID = "CTOKEN_TOTAL_SUPPLY_SWR_ID";
export const CTOKEN_BALANCE_SWR_ID = "CTOKEN_BALANCE_SWR_ID";
export const CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID =
  "CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID";
export const CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID =
  "CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID";
const c = initContract({ abi });
const cu = initContract({ abi: cuabi });

// contractAddr: ctoken address
function useCToken(contractAddr, custodianContractAddr) {
  const { address: userAddr } = useConfluxPortal();

  const { data: totalSupply, totalSupplyErr } = useEpochNumberSWR(
    contractAddr ? [CTOKEN_TOTAL_SUPPLY_SWR_ID, contractAddr] : null,
    () => c.totalSupply().call({ to: contractAddr })
  );

  if (totalSupplyErr)
    console.error(`Error get totalSupply: ${totalSupplyErr.message}`);

  const { data: balance, balanceErr } = useEpochNumberSWR(
    contractAddr ? [CTOKEN_BALANCE_SWR_ID, contractAddr, userAddr] : null,
    () => c.balanceOf(userAddr).call({ to: contractAddr })
  );

  if (balanceErr) console.error(`Error get balance: ${balanceErr.message}`);

  const {
    data: refTokenAddr,
    error: refTokenAddrError,
  } = useSWR(
    custodianContractAddr && contractAddr
      ? [CTOKEN_TO_REF_TOKEN_ADDR_SWR_ID, custodianContractAddr, contractAddr]
      : null,
    () => cu.token_reference(contractAddr).call({ to: custodianContractAddr })
  );
  if (refTokenAddrError)
    console.error(`[refTokenAddrError]: ${refTokenAddrError.message}`);

  const {
    data: refTokenDecimal,
    error: refTokenDecimalError,
  } = useSWR(
    custodianContractAddr && contractAddr
      ? [
          CTOKEN_TO_REF_TOKEN_DECIMALS_SWR_ID,
          custodianContractAddr,
          contractAddr,
        ]
      : null,
    () => cu.token_decimals(contractAddr).call({ to: custodianContractAddr })
  );

  if (refTokenDecimalError)
    console.error(`[refTokenDecimalError]: ${refTokenDecimalError.message}`);

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
