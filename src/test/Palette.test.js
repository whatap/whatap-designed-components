var assert = require('assert');
var Palette = require('../Palette').Palette;

var palette = new Palette();

console.log("1. Testing multiple oid");

assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(116,143,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(146,143,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(146,173,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(176,173,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(176,203,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(206,203,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(206,233,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(236,233,252)"
)
assert.equal(
  palette.getColorFromPalette(1234567890),
  "rgb(236,7,252)"
)

console.log("2. Testing another oid");

assert.equal(
  palette.getColorFromPalette(1234567891),
  "rgb(26,35,126)"
)

assert.equal(
  palette.getColorFromPalette(1234567891),
  "rgb(56,35,126)"
)

var palette2 = new Palette();

console.log("3. Get RGB from Oid && Get Oid from RGB");
assert.equal(
  palette2.getColorFromPalette(1234567890),
  "rgb(116,143,252)"
)

assert.equal(
  palette2.getOidFromColor("rgb(116,143,252)"),
  1234567890
)

assert.equal(
  palette2.getColorFromPalette(1234567890),
  "rgb(146,143,252)"
)

assert.equal(
  palette2.getOidFromColor("rgb(146,143,252)"),
  1234567890
)

assert.equal(
  palette2.getColorFromPalette(1234567890),
  "rgb(146,173,252)"
)

assert.equal(
  palette2.getOidFromColor("rgb(146,173,252)"),
  1234567890
)

console.log("** Completed ** ");
