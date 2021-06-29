export default function initContract(params, sdkCfxInstance) {
  return window?.confluxJS?.Contract(params, sdkCfxInstance);
}
