export default function initContract(params) {
  if (window && window.confluxJS && window.confluxJS.Contract)
    return window.confluxJS.Contract(params);
}
