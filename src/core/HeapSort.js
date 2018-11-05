export default class HeapSort {
  constructor() {

  }

  sort = (array, isClone) => {
    if (!Array.isArray(array)) throw new Error("Must provide valid array");

    if (isClone) {
      array = [ ...array ];
    }

    let n = array.length;

    let start = parseInt(n / 2 - 1);
    for (let i = start; i >= 0; i--) {
      this.heapify(array, n, i);
    }

    for (let j = n - 1; j >= 0; j--) {
      let temp = array[0];
      array[0] = array[j];
      array[j] = temp;

      this.heapify(array, j, 0);
    }

    if (isClone) {
      return array;
    }
  }

  heapify = (arr, n, i) => {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      let swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;

      this.heapify(arr, n, largest);
    }
  }
}