/*global describe, it, expect, beforeEach, afterEach, getFunctionByName, insertionSort, inputLength,DEFAULT_INPUT_LENGTH , inputIntegerMax, DEFAULT_INPUT_INTEGER_MAX,inputNumberRuns ,DEFAULT_INPUT_NUMBER_RUNS  */
describe("sorts", function() {
    "use strict";
    var array = [];

    beforeEach(function(){
        inputLength = DEFAULT_INPUT_LENGTH;
        inputIntegerMax = DEFAULT_INPUT_INTEGER_MAX;
        inputNumberRuns = DEFAULT_INPUT_NUMBER_RUNS;
        array = genInput();
    });

    afterEach(function(){

    });

    /*helper function that will obviously check if an array is in sorted order*/
    function isArraySorted(arr)
    {
        var max = arr[0].id;
        var sorted = true;

        for(var i = 1; i < arr.length; i++) {
            if(max > arr[i].id) {
                sorted = false; break;
            }
        }

        return sorted;
    }

    function regularTests(sortingFunction)
    {
        it(sortingFunction+" will sort an array",function(){
            expect(getFunctionByName(sortingFunction)([9,5,3,7,1,2])).toEqual([1,2,3,5,7,9]);
        });
        it(sortingFunction+" will sort an already sorted array",function(){
            expect(getFunctionByName(sortingFunction)([1,2,3,5,7,9])).toEqual([1,2,3,5,7,9]);
        });
        it(sortingFunction+" will sort a reverse sorted array",function(){
            expect(getFunctionByName(sortingFunction)([9,7,5,3,2,1])).toEqual([1,2,3,5,7,9]);
        });
        it(sortingFunction+" will not break on an array of length 1",function(){
            expect(getFunctionByName(sortingFunction)([1])).toEqual([1]);
        });
        it(sortingFunction+" will not break on an empty array",function(){
            expect(getFunctionByName(sortingFunction)([])).toEqual([]);
        });
        it(sortingFunction+" will sort the larger genInput-function-created array",function(){
            var testArray = getFunctionByName(sortingFunction)(array.slice()); //copy and sort array
            expect(getFunctionByName(sortingFunction)(array)).toEqual(testArray);
        });
        it(sortingFunction+" will actually sort the input",function(){
            var testArray = getFunctionByName(sortingFunction)(array.slice()); //copy and sort array
            expect(isArraySorted(testArray)).toBeTrue();
        });
    }

    describe("insertionSort", function(){
        regularTests(this.description);
    });

    describe("mergeSort", function(){
        regularTests(this.description);
    });

    describe("bubbleSort", function(){
        regularTests(this.description);
    });

    describe("quickSort", function(){
        regularTests(this.description);
    });

    describe("selectionSort", function(){
        regularTests(this.description);
    });



});