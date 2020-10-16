export { default as useConfluxPortal } from "./useConfluxPortal";
import {
  useEpochNumber,
  useEpochNumberFn,
  setupEpochListener,
} from "./useEpochNumber";
export { default as useBalance } from "./useBalance";
export { useEpochNumber, useEpochNumberFn };
export { default as useSWR, useEpochNumberSWR } from "./swr";
export { default as initContract } from "./initContract";
export * as shuttleFlow from "./shuttleflow";
export { default as useConfluxJSDefined } from "./useConfluxJSDefined";
export { default as useStatus } from "./useStatus";

setupEpochListener();
