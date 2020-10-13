import { wrapIsPortalInstalled } from "./useConfluxPortal";
import { useEvent } from "react-use";
import { useState } from "react";

let EPOCH_NUMBER_UPDATED_EVENT_DATA = { detail: null };
const EPOCH_NUMBER_UPDATED_EVENT = new CustomEvent(
  "epochNumberUpdated",
  EPOCH_NUMBER_UPDATED_EVENT_DATA
);

function dispatchEpochNumberUpdated() {
  window.confluxJS.getEpochNumber().then((epochNumber) => {
    EPOCH_NUMBER_UPDATED_EVENT_DATA.detail = epochNumber;
    window.dispatchEvent(EPOCH_NUMBER_UPDATED_EVENT);
  });
}

export function setupEpochListener(interval = 3000) {
  if (!window || !window.confluxJS) return;
  if (window.__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL !== undefined)
    clearInterval(__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL);
  dispatchEpochNumberUpdated();
  window.__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL = setInterval(
    dispatchEpochNumberUpdated,
    interval
  );
}

function useEpochNumberPortalInstalled() {
  const [epochNumber, setEpochNumber] = useState(
    EPOCH_NUMBER_UPDATED_EVENT_DATA.epochNumber
  );
  useEvent("epochNumberUpdated", () => {
    setEpochNumber(EPOCH_NUMBER_UPDATED_EVENT_DATA.detail);
  });

  return epochNumber;
}

export const useEpochNumber = wrapIsPortalInstalled(
  useEpochNumberPortalInstalled,
  null
);

export const useEpochNumberFn = (cb) =>
  useEvent("epochNumberUpdated", cb(EPOCH_NUMBER_UPDATED_EVENT_DATA.detail));
