import { wrapIsPortalInstalled } from "./useConfluxPortal";
import useSWR from "./swr";

const EPOCH_NUMBER_SWR_ID = "EPOCH_NUMBER_SWR_ID";

export default wrapIsPortalInstalled(useEpochNumber, [null, null, () => {}]);

function useEpochNumber(interval = 3000) {
  const { data: epochNumber, error, mutate } = useSWR(
    EPOCH_NUMBER_SWR_ID,
    () => window.confluxJS.getEpochNumber(),
    {
      revalidateOnMount: true,
      refreshInterval: interval,
      dedupingInterval: interval,
    }
  );

  return [epochNumber, error, mutate];
}
