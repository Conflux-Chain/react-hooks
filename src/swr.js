import useSWR from "swr";
import { useIdle, useEvent } from "react-use";
import { useConfluxJSDefined } from "./";
import { useEffect } from "react";

export default function useIdleSWR(...args) {
  const [key, ...rest] = args;
  let idleDelay = 300e3;
  if (args[1] && args[1].idleDelay) idleDelay = args[1].idleDelay;
  if (args[2] && args[2].idleDelay) idleDelay = args[2].idleDelay;
  return useSWR(useIdle(idleDelay) ? null : key, ...rest);
}

export function useEpochNumberSWR(...args) {
  const confluxJSDefined = useConfluxJSDefined();
  const [key, ...rest] = args;
  const swrRst = useIdleSWR(confluxJSDefined ? key : null, ...rest);
  useEffect(() => {
    swrRst.mutate();
  }, [confluxJSDefined]);
  useEvent("epochNumberUpdated", () => swrRst.mutate());
  return swrRst;
}
