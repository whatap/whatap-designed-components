var assert = require('assert');
var Palette = require('../Palette').Palette;

/**
 * localStorage support for unit testing within nodejs environment.
 * Will not effect Production as it is geared towards Browser environment.
 */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./testfile');
}

var palette = new Palette(12345, true);

console.log("1. `getColorFromId` on same oid")
assert.equal(
  palette.getColorFromId(1),
  "rgb(50,154,240)"
)

assert.equal(
  palette.getColorFromId(1),
  "rgb(50,154,240)"
)
assert.equal(
  palette.getColorFromId(1),
  "rgb(50,154,240)"
)

console.log("2. `getColorFromId` on multiple oids");
assert.equal(
  palette.getColorFromId(2),
  "rgb(242,222,34)"
)
assert.equal(
  palette.getColorFromId(3),
  "rgb(255,95,95)"
)
assert.equal(
  palette.getColorFromId(4),
  "rgb(0,183,208)"
)
assert.equal(
  palette.getColorFromId(5),
  "rgb(14,229,177)"
)
assert.equal(
  palette.getColorFromId(6),
  "rgb(21,101,192)"
)
assert.equal(
  palette.getColorFromId(7),
  "rgb(181,189,196)"
)
assert.equal(
  palette.getColorFromId(8),
  "rgb(255,157,51)"
)
assert.equal(
  palette.getColorFromId(9),
  "rgb(132,94,247)"
)
assert.equal(
  palette.getColorFromId(10),
  "rgb(243,195,57)"
)
assert.equal(
  palette.getColorFromId(11),
  "rgb(116,143,252)"
)
assert.equal(
  palette.getColorFromId(12),
  "rgb(26,35,126)"
)
assert.equal(
  palette.getColorFromId(13),
  "rgb(6,198,6)"
)
assert.equal(
  palette.getColorFromId(14),
  "rgb(188,131,255)"
)
assert.equal(
  palette.getColorFromId(15),
  "rgb(255,149,251)"
)
assert.equal(
  palette.getColorFromId(16),
  "rgb(161,229,172)"
)
assert.equal(
  palette.getColorFromId(17),
  "rgb(114,195,252)"
)

console.log("#. `getColorFromId` after first palette rotation");
assert.equal(
  palette.getColorFromId(18),
  "rgb(60,154,240)"
)
assert.equal(
  palette.getColorFromId(19),
  "rgb(242,222,44)"
)
assert.equal(
  palette.getColorFromId(20),
  "rgb(255,105,95)"
)
assert.equal(
  palette.getColorFromId(21),
  "rgb(10,183,208)"
)
assert.equal(
  palette.getColorFromId(22),
  "rgb(24,229,177)"
)
assert.equal(
  palette.getColorFromId(23),
  "rgb(31,101,192)"
)

console.log("3. `getIdFromColor` on multiple rgb values");
assert.equal(
  palette.getIdFromColor("rgb(24,229,177)"),
  22
)
assert.equal(
  palette.getIdFromColor("rgb(242,222,44)"),
  19
)
assert.equal(
  palette.getIdFromColor("rgb(161,229,172)"),
  16
)
assert.equal(
  palette.getIdFromColor("rgb(50,154,240)"),
  1
)

console.log("4. localStorage testing on multiple instances");
var palette_clone = new Palette(12345, true);

assert.equal(
  palette_clone.getIdFromColor("rgb(24,229,177)"),
  22
)
assert.equal(
  palette_clone.getIdFromColor("rgb(242,222,44)"),
  19
)
assert.equal(
  palette_clone.getIdFromColor("rgb(161,229,172)"),
  16
)
assert.equal(
  palette_clone.getIdFromColor("rgb(50,154,240)"),
  1
)

console.log("5. Do not load with same id");
var palette_no_load = new Palette(12345, false);
assert.equal(
  palette_no_load.getIdFromColor("rgb(50,154,240)"),
  0
)
assert.equal(
  palette_no_load.getColorFromId(3),
  "rgb(50,154,240)"
)



console.log("** All tests have passed **");