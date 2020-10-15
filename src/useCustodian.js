import {
  useConfluxJSDefined,
  useEpochNumberSWR,
  initContract,
  useConfluxPortal,
} from "./";
import { useEffect } from "react";
import abi from "./contracts/CustodianImpl.json";

let c = initContract({ abi });
const CUSTODIAN_TOKEN_LIST_SWR_ID = "CUSTODIAN_TOKEN_LIST_SWR_ID";

/**
 * interact with the shuttleflow custodian contract, can only be used with
 ConfluxPortal installed
 * @param {Address} contractAddr the shuttleflow custodian proxy contract address
 * @param {boolean=false} getTokenList should this hook query token list
 * @returns {Object} check the return code below
 */
export default function useCustodian(contractAddr, getTokenList = false) {
  const confluxJSDefined = useConfluxJSDefined();

  useEffect(() => {
    if (confluxJSDefined && !c) {
      c = initContract({ abi });
    }
  }, [confluxJSDefined]);

  const { address: userAddr } = useConfluxPortal();

  const {
    data: tokenList,
    error: tokenListErr,
  } = useEpochNumberSWR(
    getTokenList ? [CUSTODIAN_TOKEN_LIST_SWR_ID, contractAddr] : null,
    c?.tokenList(),
    { initialData: [] }
  );

  if (tokenListErr)
    console.error(`Error get tokenList: ${tokenListErr.message}`);

  // cTokenAddrToRefTokenAddr may return 'eth', 'btc', normal address like '0xdac17f958d2ee523a2206206994597c13d831ec7'
  return {
    tokenList,
    cTokenAddrToRefTokenAddr: (cAddr) =>
      c?.token_reference(cAddr)?.call({ to: contractAddr }),
    cTokenAddrToRefTokenDeicmals: (cAddr) =>
      c?.token_decimals(cAddr)?.call({ to: contractAddr }),
    isRefTokenAdminToken: (refAddr) =>
      c?.admin_token(refAddr)?.call({ to: contractAddr }),
    refTokenBurnFee: (refAddr) =>
      c?.burn_fee(refAddr)?.call({ to: contractAddr }),
    refTokenMintFee: (refAddr) =>
      c?.mint_fee(refAddr)?.call({ to: contractAddr }),
    refTokenWalletFee: (refAddr) =>
      c?.wallet_fee(refAddr)?.call({ to: contractAddr }),
    refTokenMinMintValue: (refAddr) =>
      c?.minimal_mint_value(refAddr)?.call({ to: contractAddr }),
    btcMinMintValue: () =>
      c?.btc_minimal_mint_value()?.call({ to: contractAddr }),
    refTokenMinBurnValue: (refAddr) =>
      c?.minimal_burn_value(refAddr)?.call({ to: contractAddr }),
    btcMinBurnValue: () =>
      c?.btc_minimal_burn_value()?.call({ to: contractAddr }),
    minSponsorCETH: () =>
      c.minimal_sponsor_amount()?.call({ to: contractAddr }),
    /*
      function sponsorToken(
      string memory ref, // lowercase erc20 ethereum address
      uint256 amount, // amount of cETH mortgaged
      uint256 _burn_fee, // burn fee of erc20 token, in erc20 decimals
      uint256 _mint_fee, // mint fee of erc20 token, in erc20 decimals
      uint256 _wallet_fee, // receive wallet fee of erc20 token, in erc20 decimals
      uint256 _minimal_mint_value, // minimal mint value of erc20 token, in erc20 decimals
      uint256 _minimal_burn_value // minimal burn value of erc20 token, in erc20 decimals
      ) public;
    */
    sponsorAToken: (
      refAddr,
      amount,
      burnFee,
      mintFee,
      walletFee,
      minimalMintValue,
      minimalBurnValue
    ) =>
      userAddr
        ? c
            ?.sponsorToken(
              refAddr,
              amount,
              burnFee,
              mintFee,
              walletFee,
              minimalMintValue,
              minimalBurnValue
            )
            ?.sendTransaction({ from: userAddr, to: contractAddr })
        : Promise.reject("portal not installed"),
    /*
      function setTokenParams(
      string memory ref, // lowercase erc20 ethereum address
      uint256 _burn_fee,
      uint256 _mint_fee,
      uint256 _wallet_fee,
      uint256 _minimal_mint_value,
      uint256 _minimal_burn_value
      ) public;
      */
    setTokenParams: (
      refAddr,
      burnFee,
      mintFee,
      walletFee,
      minimalMintValue,
      minimalBurnValue
    ) =>
      userAddr
        ? c
            ?.setTokenParams(
              refAddr,
              burnFee,
              mintFee,
              walletFee,
              minimalMintValue,
              minimalBurnValue
            )
            ?.sendTransaction({ from: userAddr, to: contractAddr })
        : Promise.reject("portal not installed"),
  };
}
