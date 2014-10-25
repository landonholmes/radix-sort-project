/*global $,console*/
/*variables*/
var logDiv = $("div#log"),
    mainButton = $("button#main"),
    cleanButton = $("button#clean"),
    cleanNotLastButton = $("button#cleanKeepLast"),
    resetInputsButton = $("button#resetInputs"),
    inputLenField = $("input#inputLen"),
    inputNumMaxField = $("input#inputNumMax"),
    inputNumRunsField = $("input#inputNumRuns");

var DEFAULT_INPUT_LENGTH = 2000,
    DEFAULT_INPUT_INTEGER_MAX = 2000,
    DEFAULT_INPUT_NUMBER_RUNS = 100,
    TIMER_ACCURACY = 1000,
    inputLength = checkLocalStorage("inputLength", DEFAULT_INPUT_LENGTH),
    inputIntegerMax = checkLocalStorage("inputIntegerMax", DEFAULT_INPUT_INTEGER_MAX),
    inputNumberRuns = checkLocalStorage("inputNumberRuns",DEFAULT_INPUT_NUMBER_RUNS),
    currentLog = 1,
    currArr; /*global variable to keep track of current array*/

/*when the page is loaded, run this stuff*/
$(document).ready( function() {
    /*call the main function*/
    main();

    inputLenField.val(inputLength);
    inputNumMaxField.val(inputIntegerMax);
    inputNumRunsField.val(inputNumberRuns);

    /*some event binders*/
    mainButton.bind("click", main);
    cleanButton.bind("click", cleanUp);
    cleanNotLastButton.bind("click", cleanUpNotLast);
    resetInputsButton.bind("click", resetInputs);
    $("input").bind("keypress", checkInput);

    inputLenField.bind("keyup", function(e){
        inputLength = $(this).val();
        localStorage.setItem("inputLength",$(this).val());

    });
    inputNumMaxField.bind("keyup", function(e){
        inputIntegerMax = $(this).val();
        localStorage.setItem("inputIntegerMax",$(this).val());
    });
    inputNumRunsField.bind("keyup", function(e){
        inputNumberRuns = $(this).val();
        localStorage.setItem("inputNumberRuns",$(this).val());
    });
});

/*the main function*/
function main()
{
    currArr = genInput();

    var tempArr = currArr.slice();
    doSort(tempArr, RadixSort);
}

/*wrapper function that will log the time taken to do the sort for an input*/
function doSort(arr, sort)
{
    log("Before Sorting: ",currArr);

    var tempArr;
    var timeTaken = 0; /*variable used to calculate avg time taken based on inputNumberRuns */

    for (var i=0; i< inputNumberRuns; i++) {
        tempArr = currArr.slice(); /*make a copy of the original*/

        /*sort the copy however many times*/
        var before = performance.now();
        RadixSort(tempArr);
        var after = performance.now();
        timeTaken += (after-before); /*add the time up*/
    }
    timeTaken = timeTaken/inputNumberRuns; /*calculate the avg time*/

    log("\nAfter sorting: ",tempArr);

    log("<b>"+displayTimer(timeTaken), "</b> For Length: ", inputLength," Max Int Length: ",inputIntegerMax," For "+inputNumberRuns," runs");

    incrementLog();
}

/*counting sort function*/
function CountingSort(a, x)
{
    var len = a.length; /*length of the array in a variable*/
    var c = [];  /*create the array of counts*/
    var b = []; /*create the output array*/
    var i;

    /*fill the array with empty values*/
    for (i = 0; i < 10; i++) {
        c[i] = 0;
    }
    /*fill the array with empty values*/
    for (i = 0; i < len; i++) {
        b[i] = 0;
    }

    /*loop through the array to be sorted and create counts of each integer*/
    for (i = 0; i < len; i++) {
        c[Math.floor((a[i] / x) % 10)]++;
    }

    /*loop through C and compute the running sum of the counters c[i] is the num of elements in a that are <= to i */
    for (i = 1; i < 10; i++) {
        c[i] += c[i-1];
    }

    /*loop through the array of counts and make the output array based on the input array's counts*/
    for (i = len - 1; i >= 0; i--)
    {
        b[ c[ Math.floor((a[i]/x)%10) ] - 1] = a[i];
        c[ Math.floor((a[i]/x)%10) ]--;
    }

    /*copy new array back over original array*/
    for (i=0; i < len; i++) {
        a[i] = b[i];
    }

}

/*radix sort with counting sort subroutine*/
function RadixSort(arr)
{
    var max = Math.max.apply(Math,arr); /*getting max value of the array*/

    /*do the loop for each digit*/
    for (var x=1; Math.floor(max/x) > 0; x *= 10) {
        CountingSort(arr, x);   /*call counting sort with a specific digit*/
    }

    /*return the beautifully sorted array*/
    return arr;
}

/*some helper functions*/
/*function to generate an input based on the global variables*/
function genInput()
{
    var n = [];

    for(var i=0;i<inputLength;i++)
    {
        n.push(Math.floor(Math.random() * inputIntegerMax));
    }

    return n;
}

/*helper function to display on the browser and console what is happening*/
function log()
{
    var toAppend = "";  /*create a toAppend string to avoid jquery parsing our strings to html too early*/
    toAppend += '<p class="log'+currentLog+'">'; /*start the log entry*/
    toAppend += formatTime(new Date())+' - '; /*add the timestamp*/

    /*append all the arguments*/
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
        toAppend += arguments[i].toString();
    }
    toAppend += '</p>'; /*close the p tag*/

    /*after we pushed everything we want to the toAppend array, join it all together and append it*/
    logDiv.append(toAppend);
}

function incrementLog()
{
    logDiv.append('<hr class="log'+currentLog+'" />');
    currentLog++;
}

/*function to be called to clean up any messiness going on*/
function cleanUp()
{
    /*empty the log*/
    logDiv.empty();
}

/*function to be called to clean up any messiness going on except the last log entry*/
function cleanUpNotLast()
{
    /*empty the log except for the most recent log entry*/
    logDiv.children().not(".log"+(currentLog-1)).remove();
}

/*function to format javascript timestamp correctly*/
function formatTime(timestamp)
{
    /*get each of the components of the timestamp*/
    var hours = timestamp.getHours();
    var minutes = timestamp.getMinutes();
    var seconds = timestamp.getSeconds();

    /*prepend the zero here when needed*/
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}

/*function to display the time*/
function displayTimer(before, after)
{
    /*if we give it just a length of time, format that*/
    if (arguments.length == 1) {
        return  "Sort Time Taken: "+Math.floor((before) * TIMER_ACCURACY) / TIMER_ACCURACY+" ms";
    } else { /*or we gave it an interval and we need to calculate the length of time*/
        /*return the string built with the timer information*/
        return  "Sort Time Taken: "+Math.floor((after-before) * TIMER_ACCURACY) / TIMER_ACCURACY+" ms";
    }
}

/*checks local storage for a variable and returns it if it finds it or returns null if not*/
function checkLocalStorage(name, defaultValue)
{
    if (localStorage.getItem(name) != null) {
        return JSON.parse(localStorage.getItem(name));
    } else {
        localStorage.setItem(name, JSON.stringify(defaultValue));
        return defaultValue;
    }
}

/*function to check input for non-numerics and block them*/
function checkInput(e)
{
    var regex = new RegExp('^[0-9]+$');
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode); /*get the key pressed from event*/
    var charCode = (!e.charCode ? e.which : e.charCode);
    switch(charCode) {
        case 8: { break;} /*do nothing on backspace*/
        case 13: { mainButton.click(); /*if enter was pressed, run the sort*/ break;}
        default: {
            if (!regex.test(key)) { /*if key does not match regex*/
                e.preventDefault(); //block back input
            }
        }
    }
}

function resetInputs()
{
    inputLength = DEFAULT_INPUT_LENGTH;
    inputIntegerMax = DEFAULT_INPUT_INTEGER_MAX;
    inputNumberRuns = DEFAULT_INPUT_NUMBER_RUNS;

    localStorage.setItem("inputLength",inputLength);
    localStorage.setItem("inputIntegerMax",inputIntegerMax);
    localStorage.setItem("inputNumberRuns",inputNumberRuns);

    inputLenField.val(inputLength);
    inputNumMaxField.val(inputIntegerMax);
    inputNumRunsField.val(inputNumberRuns);
}




