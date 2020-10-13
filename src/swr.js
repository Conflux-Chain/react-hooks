import useSWR from "swr";
import { useIdle, useEvent } from "react-use";

export default function useIdleSWR(...args) {
  const [key, ...rest] = args;
  const idleDelay = args[1]?.idleDelay || args[2]?.idleDelay || 300e3;
  return useSWR(useIdle(idleDelay) ? null : key, ...rest);
}

export function useEpochNumberSWR(...args) {
  const swrRst = useIdleSWR(...args);
  useEvent("epochNumberUpdated", () => swrRst.mutate());
  return swrRst;
}
