import React, { useMemo, useState } from "react";
import {
  useStatus,
  useEpochNumber,
  useConfluxPortal,
  useBalance,
  useConfirmationRiskByHash,
} from "../src";
import ConfluxJSDefinedUI from "./ConfluxJSDefinedUI";

export default {
  title: "General",
};

const UseConfluxPortalTemplate = () => {
  const {
    portalInstalled,
    address,
    balances: [cfxBalance, tokenBalances],
    login,
    useEnsurePortalLogin,
  } = useConfluxPortal([
    "0x87010faf5964d67ed070bc4b8dcafa1e1adc0997", // fc contract address
    "0x85b1432b900ec2552a3f119d4e99f4b0f8078e29", // ceth contract address
  ]);

  useEnsurePortalLogin();
  const loggedIn = Boolean(address);
  const [fcBalance, cethBalance] = tokenBalances.map((b) =>
    (b / 1e18).toString()
  );

  return (
    <>
      <p>portalInstalled: {portalInstalled.toString()}</p>
      <p>address: {address}</p>
      <p>CFX balance: {(cfxBalance / 1e18).toString()} CFX</p>
      <div>
        token balances:
        <p> FC: {fcBalance} FC</p>
        <p> CETH: {cethBalance} CETH</p>
      </div>
      <button disabled={loggedIn || !portalInstalled} onClick={login}>
        {portalInstalled
          ? loggedIn
            ? "Already logged in"
            : "login into portal"
          : "Portal not installed"}
      </button>
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseConfluxPortal = UseConfluxPortalTemplate.bind({});

const UseEpochNumberTemplate = () => {
  const epochNumber = useEpochNumber();

  return (
    <>
      <p>epochNumber: {epochNumber}</p>
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseEpochNumber = UseEpochNumberTemplate.bind({});

const UseBalanceTemplate = () => {
  const userAddr = "0x1202894ac930192145a0904daed5e21333115744";
  const tokenAddrs = [
    "0x87010faf5964d67ed070bc4b8dcafa1e1adc0997", // fc contract address
    "0x85b1432b900ec2552a3f119d4e99f4b0f8078e29", // ceth contract address
  ];
  const [balance, [fcBalance, cethBalance]] = useBalance(userAddr, tokenAddrs);

  return (
    <>
      <p>CFX Balance: {(balance / 1e18).toString()} CFX</p>
      <p>FC Balance: {(fcBalance / 1e18).toString()} FC</p>
      <p>cETH Balance: {(cethBalance / 1e18).toString()} cETH</p>
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseBalance = UseBalanceTemplate.bind({});

const UseStatusTemplate = () => {
  const status = useStatus();

  return (
    <>
      <p>Status: {JSON.stringify(status)} CFX</p>
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseStatus = UseStatusTemplate.bind({});

const UseConfirmationRiskTemplate = () => {
  const [resetCount, setResetCount] = useState(1);
  const status = useStatus();
  const currentBlockHash = useMemo(() => status?.bestHash, [
    Boolean(status?.bestHash),
    resetCount,
  ]);
  const risk = useConfirmationRiskByHash(currentBlockHash);

  return (
    <>
      <p>block: {currentBlockHash}</p>
      <p>risk: {risk}</p>
      <button onClick={() => setResetCount((c) => c + 1)}>
        try another block
      </button>
      <ConfluxJSDefinedUI />
    </>
  );
};

export const UseConfirmationRisk = UseConfirmationRiskTemplate.bind({});
