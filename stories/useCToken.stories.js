import React, { useState } from "react";
import { useCToken } from "../shuttleflow";
import { useConfluxPortal } from "../index";

export default {
  title: "Shuttleflow",
  component: useCToken,
};

const UseCTokenTemplateSimulation = () => {
  const cethAddress = "0x83dfad4705a2bcf8b961bf0fdeac2f22738dc74f";
  const custodianProxyAddress = "0x82209899b1faa5f32ec80a7c7efb34aee7273d90";
  const {
    totalSupply,
    balance,
    refTokenAddress,
    refTokenDecimal,
    burn,
  } = useCToken(cethAddress, custodianProxyAddress);

  const [burnning, setBurnning] = useState(false);
  const [burnRst, setBurnRst] = useState("");
  const { address: userAddress } = useConfluxPortal();
  const shuttleout = async () => {
    try {
      setBurnning(true);
      const rst = await burn(
        userAddress,
        1,
        1,
        "0x83dfad4705a2bcf8b961bf0fdeac2f22738dc74f",
        "0x0000000000000000000000000000000000000000"
      );
      setBurnning(false);
      setBurnRst(rst);
    } catch (err) {
      setBurnRst(err);
      setBurnning(false);
      throw err;
    }
  };
  return (
    <>
      <h1> 模拟盘 </h1>
      <p>CETH total supply: {(totalSupply / 1e18).toString()} CETH</p>
      <p>Current User CETH balance: {(balance / 1e18).toString()} CETH</p>
      <p>Ref token address: {refTokenAddress}</p>
      <p>Ref token decimal: {refTokenDecimal}</p>
      <button disabled={burnning} onClick={shuttleout}>
        burn
      </button>
      <p>Burnning: {burnning.toString()}</p>
      <p>Burn result: {JSON.stringify(burnRst)}</p>
    </>
  );
};

const UseCTokenTemplate = () => {
  const cethAddress = "0x85b1432b900ec2552a3f119d4e99f4b0f8078e29";
  const custodianProxyAddress = "0x8d315799a20bcf3afcd18e3a44e98973b49ea9da";
  const { totalSupply, balance, refTokenAddress, refTokenDecimal } = useCToken(
    cethAddress,
    custodianProxyAddress
  );
  return (
    <>
      <h1> 正式盘 </h1>
      <p>CETH total supply: {(totalSupply / 1e18).toString()} CETH</p>
      <p>Current User CETH balance: {(balance / 1e18).toString()} CETH</p>
      <p>Ref token address: {refTokenAddress}</p>
      <p>Ref token decimal: {refTokenDecimal}</p>

      <UseCTokenTemplateSimulation />
    </>
  );
};

export const UseCToken = UseCTokenTemplate.bind({});
