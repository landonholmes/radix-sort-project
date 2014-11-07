/*this file is for implementing other sorts for comparison against radix sort*/
var sorts = {};

function insertionSort(arr)
{
    "use strict";
    var value; /*variable to hold current compare value*/

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
function mergeSort(arr)
{
    if (arr.length < 2) {
        return arr;
    }

    var middle = Math.floor(arr.length / 2),
        left    = arr.slice(0, middle),
        right   = arr.slice(middle),
        params = merge(mergeSort(left), mergeSort(right));

    params.unshift(0, arr.length);
    arr.splice.apply(arr, params);
    return arr;
}

/*mergeSort helper function*/
function merge(left, right)
{
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

/*bubbleSort*/
function bubbleSort(arr)
{
    var len = arr.length,
        i,
        j,
        stop;

    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (arr[j] > arr[j+1]){
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

/*quickSort*/
function quickSort(arr, left, right)
{
    "use strict";
    var index;

    /*make sure array has length*/
    if (arr.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? arr.length - 1 : right;

        /*split the array*/
        index = partition(arr, left, right);

        /*check then sort left*/
        if (left < index - 1) {
            quickSort(arr, left, index - 1);
        }

        /*check then sort right*/
        if (index < right) {
            quickSort(arr, index, right);
        }
    }
    return arr;
}

/*helper partition function for quicksort*/
function partition(arr, left, right)
{
    var pivot = arr[Math.floor((right + left) / 2)],  // pivot value is middle item
        i = left,
        j = right;

    /*loop while indices aren't the same*/
    while (i <= j) {
        while (arr[i] < pivot) {
            i++;
        }

        // if right item is greater, continue left
        while (arr[j] > pivot) {
            j--;
        }

        if (i <= j) {
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;


            i++;
            j--;
        }
    }
    return i;
}

/*selectionSort*/
function selectionSort(arr){

    var len = arr.length,
        min,
        i,
        j;

    for (i=0; i < len; i++){
        /*set min*/
        min = i;

        /*loop through array and check for smaller*/
        for (j=i+1; j < len; j++){
            if (arr[j] < arr[min]){
                min = j;
            }
        }

        /*if it isnt the min, swap*/
        if (i != min){
            var temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
        }
    }
    return arr;
}
