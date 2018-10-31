"use strict";

var assert = require('assert');

var ColorPicker = require('../color/ColorPicker').default;

var HashString = require('../color/ColorPicker').HashString;

var whatap = new ColorPicker();
console.log("1. Testing palette validity");
assert.equal(whatap.fromPalette("periwinkle"), '#748ffc');
assert.equal(whatap.fromPalette("paleGreen"), '#a1e5ac');
assert.equal(whatap.fromPalette("royalBlue"), '#1565c0');
console.log("** Completed **");
console.log("2. Testing string hash & integer");
assert.equal(whatap.fromInteger(HashString("Hello, World!")), whatap.fromString("Hello, World!"));
assert.equal(whatap.fromInteger(HashString("Thank you WhaTap")), whatap.fromString("Thank you WhaTap"));
console.log("** Completed **");
console.log("3. Get current color value");
whatap.setStoreColor("#ff95fb");
assert.equal(whatap.getStoreColor(), whatap.fromPalette("pink"));
console.log("** Completed **");
console.log("4. Deliberate error testing");
assert.equal(whatap.fromPalette("errorrrr"), "#000000");
console.log("** Completed **");