import { useState, useEffect } from "react";
import { useEpochNumber, initContract, wrapIsPortalInstalled } from "../";
import abi from "./contracts/TokenSponsor.json";

// contractAddress: address of the TokenSponsor contract
// tokenAddress: refernce token address
function useSponsor(contractAddress, tokenAddress) {
  const c = initContract({ abi });
  c.address = contractAddress;
  const [epochNumber] = useEpochNumber();
  const [sponsorAddress, setSponsorAddress] = useState(0);
  const [mortagedCETH, setMortagedCETH] = useState(0);
  const [sponsorReplaceRatio, setSponsorReplaceRatio] = useState(1.1);

  useEffect(() => {
    c.sponsorOf(tokenAddress).then(setSponsorAddress);
  }, [contractAddress, epochNumber]);

  useEffect(() => {
    c.sponsorValueOf(tokenAddress).then(setMortagedCETH);
  }, [tokenAddress, contractAddress, epochNumber]);

  useEffect(() => {
    c.sponsorReplaceRatio().then(setSponsorReplaceRatio);
  }, [contractAddress, epochNumber]);

  return { sponsorAddress, mortagedCETH, sponsorReplaceRatio };
}

export default wrapIsPortalInstalled(useSponsor, {
  sponsorAddress: "",
  mortagedCETH: 0,
  sponsorReplaceRatio: 0,
});
