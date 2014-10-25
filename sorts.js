/*this file is for implementing other sorts for comparison against radix sort*/

function insertionSort(arr) {

    var value;     // the value currently being compared

    for (var i=0; i < arr.length; i++) {
        /*store the current value because it may shift later*/
        value = arr[i];

        /*check if we need to shift any of the array*/
        for (var j=i-1; j > -1 && arr[j] > value; j--) {
            arr[j+1] = arr[j];
        }
        /*insert the value in the right place*/
        arr[j+1] = value;
    }

    return arr;
}

/*mergeSort function*/
function mergeSort(arr){

    if (arr.length < 2) {
        return arr;
    }

    var middle = Math.floor(arr.length / 2),
        left    = arr.slice(0, middle),
        right   = arr.slice(middle),
        params = merge(mergeSort(left), mergeSort(right));

    // Add the arguments to replace everything between 0 and last item in the array
    params.unshift(0, arr.length);
    arr.splice.apply(arr, params);
    return arr;
}

/*mergeSort helper function*/
function merge(left, right){
    var result  = [],
        leftIndex = 0,
        rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length){
        if (left[leftIndex] < right[rightIndex]){
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
