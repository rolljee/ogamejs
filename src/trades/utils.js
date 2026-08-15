// A normalized rate is usable when every term is a real, strictly positive
// number. Checking only for `NaN` let two kinds of nonsense through as if they
// were answers: `Infinity`, produced by dividing into a `0` term, and `0`
// itself, which is what an empty term (`'2::1'`) parses to. A negative worth is
// not something the game can express either.
export default function isUsableRate(values) {
  return values.every((value) => Number.isFinite(value) && value > 0);
}
