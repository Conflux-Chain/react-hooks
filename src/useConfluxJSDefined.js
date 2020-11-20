import { useState, useRef } from "react";
import { useEffectOnce } from "react-use";

let CONFLUXJS_INTERVAL_DEFINED = false;

export default function useConfluxJSDefined(customInterval = 100) {
  const [defined, setDefined] = useState(
    CONFLUXJS_INTERVAL_DEFINED || Boolean(window?.confluxJS)
  );
  const intervalRef = useRef(null);
  useEffectOnce(() => {
    if (!defined) {
      intervalRef.current = setInterval(() => {
        if (window?.confluxJS) {
          setDefined(true);
          clearInterval(intervalRef.current);
        }
      }, customInterval);

      if (
        window.localStorage.getItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE")
      ) {
        // remove cached address if portal can't detect portal
        window.localStorage.removeItem("CFXJS_REACT_HOOK_PORTAL_ADDRESS_CACHE");
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  });

  return defined;
}
