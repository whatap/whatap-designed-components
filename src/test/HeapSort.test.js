const assert = require('assert');
const HeapSort = require('../core').HeapSort;
const hs = new HeapSort();

let testArray1 = [3, 5, 7, 4, 2, 1, 0];
let testArray2 = [1, 11, 6, 2, 4, 5, 3];

console.log("HeapSort Test");
assert.strictEqual(
  hs.sort(testArray1, true).toString(),
  [0, 1, 2, 3, 4, 5, 7].toString()
)

assert.strictEqual(
  hs.sort(testArray2, true).toString(),
  [1, 2, 3, 4, 5, 6, 11].toString()
)

console.log("** Test Complete **")