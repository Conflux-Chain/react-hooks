import { useEpochNumberSWR } from "./";

const GET_STATUS_SWR_ID = "GET_STATUS_SWR_ID";

export default function useStatus() {
  const { data: status, error: getStatusError } = useEpochNumberSWR(
    [GET_STATUS_SWR_ID],
    () => window?.confluxJS?.getStatus(),
    { initialData: {}, revalidateOnMount: true }
  );

  if (getStatusError)
    console.error(`Error get status: ${getStatusError.message}`);

  return status;
}
