import { useState, useEffect } from "react";
import {
  useEpochNumber,
  initContract,
  wrapIsPortalInstalled,
  // useConfluxPortal,
} from "../";
import abi from "./contracts/CustodianImpl.json";

// contractAddress: ctoken address
function useCustodian(contractAddress, getTokenList = false) {
  const c = initContract({ abi });
  c.address = contractAddress;
  // const { address: userAddress } = useConfluxPortal();
  const [epochNumber] = useEpochNumber();
  const [tokenList, setTokenList] = useState(0);

  useEffect(() => {
    if (getTokenList) c.tokenList().then(setTokenList);
  }, [contractAddress, epochNumber, getTokenList]);

  // cTokenAddressToRefTokenAddress may return 'eth', 'btc', normal address like '0xdac17f958d2ee523a2206206994597c13d831ec7'
  return {
    tokenList,
    cTokenAddressToRefTokenAddress: c.token_reference,
    cTokenAddressToRefTokenDeicmals: c.token_decimals,
    isRefTokenAdminToken: c.admin_token,
    refTokenBurnFee: c.burn_fee,
    refTokenMintFee: c.mint_fee,
    refTokenWalletFee: c.wallet_fee,
    refTokenMinMintValue: c.minimal_mint_value,
    btcMinMintValue: c.btc_minimal_mint_value,
    refTokenMinBurnValue: c.minimal_burn_value,
    btcMinBurnValue: c.btc_minimal_burn_value,
    minSponsorCETH: c.minimal_sponsor_amount,
    sponsorAToken: c.sponsorToken,
    setTokenParams: c.setTokenParams,
  };
}

export default wrapIsPortalInstalled(useCustodian, {
  tokenList: [],
  cTokenAddressToRefTokenAddress: () => {},
  cTokenAddressToRefTokenDeicmals: () => {},
  isRefTokenAdminToken: () => {},
  refTokenBurnFee: () => {},
  refTokenMintFee: () => {},
  refTokenWalletFee: () => {},
  refTokenMinMintValue: () => {},
  btcMinMintValue: () => {},
  refTokenMinBurnValue: () => {},
  btcMinBurnValue: () => {},
  minSponsorCETH: () => {},
  sponsorAToken: () => {},
  setTokenParams: () => {},
});
