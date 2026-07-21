export default function hasNaN(args) {
  let response = false;
  args.forEach((val) => {
    if (Number.isNaN(Number(val))) {
      response = true;
    }
  });
  return response;
}
