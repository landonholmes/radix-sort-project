/*global describe, it, expect, beforeEach, afterEach */
xdescribe("sorts", function() {
    var array = [];

    beforeEach(function(){
        DEFAULT_INPUT_LENGTH = 1000;
        DEFAULT_INPUT_INTEGER_MAX = 1000;
        DEFAULT_INPUT_NUMBER_RUNS = 100;
        //array = getInput();
    });

    afterEach(function(){

    });

    it("insertion sort should sort the array",function(){
        var testArray = array.slice.sort();
        expect(insertionSort(array)).toEqual(testArray);
    });

});