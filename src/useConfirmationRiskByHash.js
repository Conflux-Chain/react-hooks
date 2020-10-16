import { useEpochNumberSWR } from "./";

const GET_CONFIRMATION_RISK_SWR_ID = "GET_CONFIRMATION_RISK_SWR_ID";

export default function useConfirmationRiskByHash(blockHash) {
  const {
    data: confirmationRisk,
    error: getConfirmationRiskError,
  } = useEpochNumberSWR(
    blockHash ? [GET_CONFIRMATION_RISK_SWR_ID, blockHash] : null,
    () => window?.confluxJS?.getConfirmationRiskByHash(blockHash)
  );

  if (getConfirmationRiskError)
    console.error(
      `Error get confirmationRisk: ${getConfirmationRiskError.message}`
    );

  return confirmationRisk;
}
