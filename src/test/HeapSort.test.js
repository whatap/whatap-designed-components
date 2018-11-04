const assert = require('assert');
const HeapSort = require('../logic/HeapSort').default;
const hs = new HeapSort();
let testArray = [3, 5, 7, 4, 2, 1, 0];


console.log("HeapSort Test");
assert.strictEqual(
  hs.sort(testArray, true).toString(),
  [0, 1, 2, 3, 4, 5, 7].toString()
)

console.log("** Test Complete **")