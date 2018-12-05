/**
 * HeapSort used for various purposes within the components
 * @copyright WhaTap Labs @ 2018.11.07
 * @author immigration9
 */
export default class HeapSort {
  /**
   * Sorting method. When passing an array with object as its element, be sure to pass `item` string to let the algorithm know which element to reference.
   * if `isClone` is set to true, this method will return a new array, thus not mutating the original.
   * @param {Array} array 
   * @param {Boolean} isClone 
   * @param {String} item 
   */
  sort(array, isClone, item) {
    if (!Array.isArray(array)) throw new Error("Must provide valid array");

    if (isClone) {
      array = [ ...array ];
    }

    let n = array.length;

    let start = parseInt(n / 2 - 1);
    for (let i = start; i >= 0; i--) {
      this.heapify(array, n, i, item);
    }

    for (let j = n - 1; j >= 0; j--) {
      let temp = array[0];
      array[0] = array[j];
      array[j] = temp;

      this.heapify(array, j, 0, item);
    }

    return array;
  }

  /**
   * @private
   * @param {Array} arr 
   * @param {Number} n 
   * @param {Number} i 
   * @param {String} item 
   */
  heapify(arr, n, i, item) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (item || item === 0) {
      let leftItem = arr[left];
      let rightItem = arr[right];
      let largestItem = arr[largest];
      if (left < n && leftItem[item] > largestItem[item]) {
        largest = left;
        largestItem = arr[largest];
      }      
      if (right < n && rightItem[item] > largestItem[item]) {
        largest = right;
      }
    } else {
      if (left < n && arr[left] > arr[largest]) {
        largest = left;
      }
      if (right < n && arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      let swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;

      this.heapify(arr, n, largest, item);
    }
  }
}