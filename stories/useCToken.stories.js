import React, { useState, useRef } from "react";
import { useCToken } from "../src/shuttleflow";
import { Big } from "../src";
import ConfluxJSDefinedUI from "./ConfluxJSDefinedUI";

export default {
  title: "Shuttleflow",
  component: useCToken,
};

const UseCTokenTemplateSimulation = () => {
  const cethAddr = "0x86d2fb177eff4be03a342951269096265b98ac46";
  const custodianProxyAddr = "0x8248210d7d45791607afb09fe4309c557202faf7";
  const {
    totalSupply,
    balance,
    refTokenAddr,
    refTokenDecimal,
    refTokenBurnFee,
    burn,
  } = useCToken(cethAddr, custodianProxyAddr);

  const [burnning, setBurnning] = useState(false);
  const [burnRst, setBurnRst] = useState("");
  const amountRef = useRef(null);
  const externalAddressRef = useRef(null);
  const shuttleout = async () => {
    try {
      setBurnning(true);
      const rst = await burn(
        0, // amount
        externalAddressRef?.current?.value //  external address
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
      <p>cETH total supply: {(Big(totalSupply) / 1e18).toString()} cETH</p>
      <p>Current User cETH balance: {(Big(balance) / 1e18).toString()} cETH</p>
      <p>Ref token address: {refTokenAddr}</p>
      <p>Ref token decimal: {refTokenDecimal}</p>
      <p>Ref token burn fee: {refTokenBurnFee?.toString()} cETH</p>
      <input ref={amountRef} type="number" placeholder="Shuttle Out Amount" />
      <input ref={externalAddressRef} placeholder="External Address" />
      <button disabled={burnning} onClick={shuttleout}>
        Burn (shuttle out)
      </button>
      <p>Burnning: {burnning.toString()}</p>
      <p>Burn tx addr: {JSON.stringify(burnRst)}</p>
    </>
  );
};

const UseCTokenTemplate = () => {
  const cethAddr = "0x86d2fb177eff4be03a342951269096265b98ac46";
  const custodianProxyAddr = "0x8248210d7d45791607afb09fe4309c557202faf7";
  const {
    totalSupply,
    balance,
    refTokenAddr,
    refTokenDecimal,
    refTokenBurnFee,
  } = useCToken(cethAddr, custodianProxyAddr);
  return (
    <>
      <h1> 正式盘 </h1>
      <p>cETH total supply: {(Big(totalSupply) / 1e18).toString()} cETH</p>
      <p>Current User cETH balance: {(Big(balance) / 1e18).toString()} cETH</p>
      <p>Ref token address: {refTokenAddr}</p>
      <p>Ref token decimal: {refTokenDecimal}</p>
      <p>Ref token burn fee: {refTokenBurnFee?.toString()} cETH</p>

      <UseCTokenTemplateSimulation />
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseCToken = UseCTokenTemplate.bind({});
