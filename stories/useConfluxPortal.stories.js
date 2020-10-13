import React from "react";
import useConfluxPortal from "../src/useConfluxPortal";
import { useEpochNumber } from "../src/useEpochNumber";

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
    </>
  );
};

export const UseConfluxPortal = UseConfluxPortalTemplate.bind({});

const UseEpochNumberTemplate = () => {
  const epochNumber = useEpochNumber();

  return (
    <>
      <p>epochNumber: {epochNumber}</p>
    </>
  );
};

export const UseEpochNumber = UseEpochNumberTemplate.bind({});
