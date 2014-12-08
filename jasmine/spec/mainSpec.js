/*global describe, it, expect, beforeEach, afterEach,findMax,genInput,DEFAULT_INPUT_LENGTH , inputIntegerMax, DEFAULT_INPUT_INTEGER_MAX,inputNumberRuns ,DEFAULT_INPUT_NUMBER_RUNS  */

describe("main", function() {
    "use strict";

    beforeEach(function(){
        inputLength = DEFAULT_INPUT_LENGTH;
        inputIntegerMax = DEFAULT_INPUT_INTEGER_MAX;
        inputNumberRuns = DEFAULT_INPUT_NUMBER_RUNS;
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

    describe("find max function", function(){

        it("will get the max of the input", function() {
            expect( findMax([1,2,3,5,8,3,8,30,10])).toBe(30);
            expect( findMax([1,2,3000,5,8,3,8,30,10])).toBe(3000);
            expect( findMax([1])).toBe(1);
            expect( findMax([-100000,-10])).toBe(-10);
        });
    });

    describe("generate input function", function(){
        var tempArray = genInput();

        it("genInput will generate an array of integers",function(){
            expect(tempArray).toBeObject();
            expect(tempArray).toBeArray();
            expect(tempArray).toBeArrayOfNumbers();
        });

        it("genInput will generate an array with length of input length",function(){
            expect(tempArray.length).toBe(inputLength);
        });

        it("genInput will generate an array with a max integer less than input max integer", function() {
            expect(findMax(tempArray)).toBeLessThan(inputIntegerMax+1); //+1 because it can be equal to max int
        });
    });

    describe("radixSort",function(){
        var array = genInput();

        it("radixSort will sort an array",function(){
            expect(radixSort([9,5,3,7,1,2])).toEqual([1,2,3,5,7,9]);
        });
        it("radixSort will sort an already sorted array",function(){
            expect(radixSort([1,2,3,5,7,9])).toEqual([1,2,3,5,7,9]);
        });
        it("radixSort will sort a reverse sorted array",function(){
            expect(radixSort([9,7,5,3,2,1])).toEqual([1,2,3,5,7,9]);
        });
        it("radixSort will not break on an array of length 1",function(){
            expect(radixSort([1])).toEqual([1]);
        });
        it("radixSort will not break on an empty array",function(){
            expect(radixSort([])).toEqual([]);
        });

        it("radixSortwill sort the larger genInput-function-created array",function(){
            var testArray = radixSort(array.slice()); //copy and sort array
            expect(radixSort(array)).toEqual(testArray);
        });
        it("radixSort will actually sort the input",function(){
            var testArray = radixSort(array.slice()); //copy and sort array
            expect(isArraySorted(radixSort(array))).toBeTrue();
        });
    });



});