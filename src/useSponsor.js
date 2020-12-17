import { useConfluxJSDefined, initContract, useEpochNumberSWR } from "./";
import { useEffect } from "react";
import abi from "./contracts/TokenSponsor.json";

export const GET_SPONSOR_OF_CTOKEN_SWR_ID = "GET_SPONSOR_OF_CTOKEN_SWR_ID";
export const GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID =
  "GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID";
export const GET_SPONSOR_REPLACE_RATIO_SWR_ID =
  "GET_SPONSOR_REPLACE_RATIO_SWR_ID";

let c = initContract({ abi });

/**
 * interact with the shuttleflow TokenSponsor contract
 * @param {Address} contractAddr TokenSponsor contract address
 * @param {Address} tokenAddr ref token address
 * @returns {Object} check the return code below
 */
export default function useSponsor(contractAddr, tokenAddr) {
  const confluxJSDefined = useConfluxJSDefined();

  useEffect(() => {
    if (confluxJSDefined && !c) {
      c = initContract({ abi });
    }
  }, [confluxJSDefined]);

  const {
    data: sponsorAddr,
    error: sponsorAddrError,
  } = useEpochNumberSWR(
    tokenAddr && contractAddr
      ? [GET_SPONSOR_OF_CTOKEN_SWR_ID, contractAddr, tokenAddr]
      : null,
    () => c?.sponsorOf(tokenAddr)?.call({ to: contractAddr })
  );

  if (sponsorAddrError)
    console.error("Get sponsorAddr err: ${sponsorAddrError.message}");

  const {
    data: mortagedCETH,
    error: mortagedCETHError,
  } = useEpochNumberSWR(
    tokenAddr && contractAddr
      ? [GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID, tokenAddr, contractAddr]
      : null,
    () => c?.sponsorValueOf(tokenAddr)?.call({ to: contractAddr })
  );

  if (mortagedCETHError)
    console.error("Get mortagedCETH err: ${mortagedCETHError.message}");

  const {
    data: sponsorReplaceRatio,
    error: sponsorReplaceRatioError,
  } = useEpochNumberSWR(
    contractAddr ? [GET_SPONSOR_REPLACE_RATIO_SWR_ID, contractAddr] : null,
    () => c?.sponsor_replace_ratio()?.call({ to: contractAddr })
  );

  if (sponsorReplaceRatioError)
    console.error(
      "Get sponsorReplaceRatio err: ${sponsorReplaceRatioError.message}"
    );

  return { sponsorAddr, mortagedCETH, sponsorReplaceRatio };
}
