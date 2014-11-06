/*global describe, it, expect, beforeEach, afterEach */

describe("main", function() {

    beforeEach(function(){
      /*  inputLength = DEFAULT_INPUT_LENGTH;
        inputIntegerMax = DEFAULT_INPUT_INTEGER_MAX;
        inputNumberRuns = DEFAULT_INPUT_NUMBER_RUNS;*/
    });

    afterEach(function(){

    });

    function findMax(arr)
    {
        var tempMax = -9007199254740992;//max integer value: 2^53 , see http://ecma262-5.com/ELS5_HTML.htm#Section_8.5
        for (var i=0; i<arr.length; i++) {
            if (arr[i] > tempMax) {
                tempMax = arr[i]
            }
        }
        return tempMax;
    }

    it("genInput should generate an object",function(){
        expect(genInput()).toBeObject();
        expect(genInput()).toBeArray();
        expect(genInput()).toBeArrayOfNumbers();
    });

    it("genInput should generate an array with length of input length",function(){
        expect(genInput().length).toBe(inputLength);
    });

    it("custom findMax function should get the max of the input", function() {
       expect(findMax([1,2,3,5,8,3,8,30,10])).toBe(30);
       expect(findMax([1,2,3000,5,8,3,8,30,10])).toBe(3000);
       expect(findMax([1])).toBe(1);
       expect(findMax([-100000,-10])).toBe(-10);
    });

    it("genInput should generate an array with a max integer less than input max integer", function() {
       expect(findMax(genInput())).toBeLessThan(inputIntegerMax+1); //+1 because it can be equal to max int
    });

});