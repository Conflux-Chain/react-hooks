import Big from "big.js";

export function to18Decimal(num, originalDecimal) {
  num = Big(num);
  originalDecimal = Number(originalDecimal);

  return num.times(1e18).div(Big(10).pow(originalDecimal));
}
