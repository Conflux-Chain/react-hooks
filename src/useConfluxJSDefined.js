import { useState, useRef } from "react";
import { useEffectOnce } from "react-use";

let CONFLUXJS_INTERVAL_DEFINED = false;

export default function useConfluxJSDefined(customInterval = 100) {
  const [defined, setDefined] = useState(CONFLUXJS_INTERVAL_DEFINED);
  const intervalRef = useRef(null);
  useEffectOnce(() => {
    if (!defined) {
      intervalRef.current = setInterval(() => {
        if (window?.confluxJS) {
          setDefined(true);
          clearInterval(intervalRef.current);
        }
      }, customInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  });

  return defined;
}
