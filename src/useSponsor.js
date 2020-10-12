import { useState, useEffect } from "react";
import { useEpochNumber, initContract, wrapIsPortalInstalled } from "../";
import abi from "./contracts/TokenSponsor.json";

const c = initContract({ abi });

// contractAddr: address of the TokenSponsor contract
// tokenAddr: refernce token address
function useSponsor(contractAddr, tokenAddr) {
  const [epochNumber] = useEpochNumber();
  const [sponsorAddr, setSponsorAddr] = useState(0);
  const [mortagedCETH, setMortagedCETH] = useState(0);
  const [sponsorReplaceRatio, setSponsorReplaceRatio] = useState(1.1);

  useEffect(() => {
    c.sponsorOf(tokenAddr).call({ to: contractAddr }).then(setSponsorAddr);
  }, [contractAddr, epochNumber]);

  useEffect(() => {
    c.sponsorValueOf(tokenAddr)
      .call({ to: contractAddr })
      .then(setMortagedCETH);
  }, [tokenAddr, contractAddr, epochNumber]);

  useEffect(() => {
    c.sponsorReplaceRatio()
      .call({ to: contractAddr })
      .then(setSponsorReplaceRatio);
  }, [contractAddr, epochNumber]);

  return { sponsorAddr, mortagedCETH, sponsorReplaceRatio };
}

export default wrapIsPortalInstalled(useSponsor, {
  sponsorAddr: "",
  mortagedCETH: 0,
  sponsorReplaceRatio: 0,
});
