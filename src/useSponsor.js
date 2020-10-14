import { initContract, wrapIsPortalInstalled, useEpochNumberSWR } from "../";
import abi from "./contracts/TokenSponsor.json";

const c = initContract({ abi });
export const GET_SPONSOR_OF_CTOKEN_SWR_ID = "GET_SPONSOR_OF_CTOKEN_SWR_ID";
export const GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID =
  "GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID";
export const GET_SPONSOR_REPLACE_RATIO_SWR_ID =
  "GET_SPONSOR_REPLACE_RATIO_SWR_ID";

// contractAddr: address of the TokenSponsor contract
// tokenAddr: refernce token address
function useSponsor(contractAddr, tokenAddr) {
  const {
    data: sponsorAddr,
    error: sponsorAddrError,
  } = useEpochNumberSWR(
    tokenAddr && contractAddr
      ? [GET_SPONSOR_OF_CTOKEN_SWR_ID, contractAddr, tokenAddr]
      : null,
    () => c.sponsorOf(tokenAddr).call({ to: contractAddr })
  );

  if (sponsorAddrError)
    console.error("Get sponsorAddr err: ${sponsorAddrError?.message}");

  const {
    data: mortagedCETH,
    error: mortagedCETHError,
  } = useEpochNumberSWR(
    tokenAddr && contractAddr
      ? [GET_MOTAGED_CETH_OF_CTOKEN_SWR_ID, tokenAddr, contractAddr]
      : null,
    () => c.sponsorValueOf(tokenAddr).call({ to: contractAddr })
  );

  if (mortagedCETHError)
    console.error("Get mortagedCETH err: ${mortagedCETHError?.message}");

  const {
    data: sponsorReplaceRatio,
    error: sponsorReplaceRatioError,
  } = useEpochNumberSWR(
    contractAddr ? [GET_SPONSOR_REPLACE_RATIO_SWR_ID, contractAddr] : null,
    () => c.sponsorReplaceRatio().call({ to: contractAddr })
  );

  if (sponsorReplaceRatioError)
    console.error(
      "Get sponsorReplaceRatio err: ${sponsorReplaceRatioError?.message}"
    );

  return { sponsorAddr, mortagedCETH, sponsorReplaceRatio };
}

export default wrapIsPortalInstalled(useSponsor, {
  sponsorAddr: "",
  mortagedCETH: 0,
  sponsorReplaceRatio: 0,
});
