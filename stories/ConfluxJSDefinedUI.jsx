/* -*- mode: js2 -*- */
/**
 * @fileOverview
 * @name ConfluxJSDefinedUI.jsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React from "react";
import { Conflux } from "js-conflux-sdk";
import { useConfluxJSDefined } from "../src";

export default function ConfluxJSDefinedUI() {
  const confluxJSDefined = useConfluxJSDefined();
  return (
    <>
      <p>
        window.confluxJS is{" "}
        {confluxJSDefined
          ? "defined, if your have portal installed and want to test this with js-conflux-sdk, try open this page in incognito mode"
          : "not defined"}
      </p>
      <button
        disabled={confluxJSDefined}
        onClick={() =>
          (window.confluxJS = new Conflux({
            url: "http://wallet-mainnet-jsonrpc.conflux-chain.org:12537",
          }))
        }
      >
        {confluxJSDefined
          ? "window.confluxJS already defined"
          : "Define window.confluxJS with js-conflux-sdk"}
      </button>
    </>
  );
}
