import { useSWR, useConfluxJSDefined } from "./";
import { useEffect } from "react";

const GET_CLIENT_VERSION_SWR_ID = "GET_CLIENT_VERSION_SWR_ID";

export default function useClientVersion() {
  const confluxJSDefined = useConfluxJSDefined();

  const {
    data: clientVersion,
    error: getClientVersionError,
    mutate,
  } = useSWR(GET_CLIENT_VERSION_SWR_ID, () =>
    window?.confluxJS?.provider?.send("cfx_clientVersion", [])
  );

  useEffect(() => {
    if (confluxJSDefined) mutate();
  }, [confluxJSDefined]);

  if (getClientVersionError)
    console.error(`Error get clientVersion: ${getClientVersionError?.message}`);

  return clientVersion;
}
