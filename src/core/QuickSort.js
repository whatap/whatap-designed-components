
const defaultOptions = {
  isClone: false,
  item: ''
}

export default class QuickSort {
  sort(array, options) {
    if (!Array.isArray(array)) throw new Error("Must provide valid array");
    if (options) {
      options = Object.assign({}, defaultOptions, options);
    }

    if (options.isClone) {
      array = [ ...array ];
    }

    let end = array.length - 1;
    this.qs(array, 0, end, options.item);

    return array;
  }

  qs(array, low, high, item) {
    if (low >= high) return;

    let mid = parseInt(low + (high - low) / 2);
    let pivot = array[mid];
    if (item.length !== 0) {
      pivot = pivot[item];
    }
    let i = low;
    let j = high;

    while (i < j) {
      let low_array = array[i];
      let high_array = array[j];
      let compare_value = false;
      if (item.length !== 0) {
        low_array = low_array[item];
        high_array = high_array[item];
        compare_value = true
      }
      while (low_array < pivot) {
        i += 1;
        low_array = array[i];
        if (compare_value) low_array = low_array[item];
      }
      while (high_array > pivot) {
        j -= 1;
        high_array = array[j];
        if (compare_value) high_array = high_array[item];
      }

      if (i <= j) {
        let swap = array[i];
        array[i] = array[j];
        array[j] = swap;
        i += 1;
        j -= 1;
      }
    }
    if (low < j) this.qs(array, low, j, item);
    if (high > i) this.qs(array, i, high, item);
  }
}