
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = hasNaN;

function hasNaN(args) {
  let response = false;
  args.forEach((val) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(val)) {
      response = true;
    }
  });
  return response;
}
