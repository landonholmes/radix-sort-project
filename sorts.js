/*this file is for implementing other sorts for comparison against radix sort*/

var insertionSort = function insertionSort(arr) {

    var value;     // the value currently being compared

    for (var i=0; i < arr.length; i++) {
        /*store the current value because it may shift later*/
        value = items[i];

        /*check if we need to shift any of the array*/
        for (var j=i-1; j > -1 && items[j] > value; j--) {
            arr[j+1] = arr[j];
        }
        /*insert the value in the right place*/
        arr[j+1] = value;
    }

    return arr;
}