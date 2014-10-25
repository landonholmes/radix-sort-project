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

/*mergeSort*/
function mergeSort(arr){

    if (arr.length < 2) {
        return arr;
    }

    var middle = Math.floor(arr.length / 2),
        left    = arr.slice(0, middle),
        right   = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

/*mergeSort helper*/
function merge(left, right){
    var result  = [],
        indexLeft = 0,
        indexRight = 0;

    while (indexLeft < left.length && indexRight < right.length){
        if (left[indexLeft] < right[indexRight]){
            result.push(left[indexLeft++]);
        } else {
            result.push(right[indexRight++]);
        }
    }

    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}
