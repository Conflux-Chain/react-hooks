export { default as useConfluxPortal } from "./useConfluxPortal"
import {
  useEpochNumber,
  useEpochNumberFn,
  setupEpochListener,
} from "./useEpochNumber"
export { default as useBalance } from "./useBalance"
export { useEpochNumber, useEpochNumberFn }
export { default as useSWR, useEpochNumberSWR } from "./swr"
export { default as initContract } from "./initContract"
export { default as useConfluxJSDefined } from "./useConfluxJSDefined"
export { default as useStatus } from "./useStatus"
export { default as useConfirmationRiskByHash } from "./useConfirmationRiskByHash"
export { default as useClientVersion } from "./useClientVersion"

export { default as Big } from "big.js"

setupEpochListener()
