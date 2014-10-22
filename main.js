/*global variables*/
var logDiv = $("div#log");
var mainButton = $("button#main");
var cleanButton = $("button#clean");
var cleanNotLastButton = $("button#cleanKeepLast");
var inputLenField = $("input#inputLen");
var inputNumLenField = $("input#inputNumLen");
var inputNumRunsField = $("input#inputNumRuns");

var INPUT_LENGTH = checkLocalStorage("INPUT_LENGTH", 2000),
    INPUT_INTEGER_LENGTH = checkLocalStorage("INPUT_INTEGER_LENGTH", 2000),
    INPUT_NUMBER_RUNS = checkLocalStorage("INPUT_NUMBER_RUNS",100),
    CURRENT_LOG = 1,
    TIMER_ACCURACY = 1000;
var n; /*global variable to keep track of current array*/

/*when the page is loaded, run this stuff*/
$(document).ready( function() {
    /*call the main function*/
    main();

    inputLenField.val(INPUT_LENGTH);
    inputNumLenField.val(INPUT_INTEGER_LENGTH);
    inputNumRunsField.val(INPUT_NUMBER_RUNS);

    /*some event binders*/
    mainButton.bind("click", main);
    cleanButton.bind("click", cleanUp);
    cleanNotLastButton.bind("click", cleanUpNotLast);
    inputLenField.bind("change", function(e){
        INPUT_LENGTH = $(this).val();
        localStorage.setItem("INPUT_LENGTH",JSON.stringify($(this).val()));
    });
    inputNumLenField.bind("change", function(e){
        INPUT_INTEGER_LENGTH = $(this).val();
        localStorage.setItem("INPUT_INTEGER_LENGTH",JSON.stringify($(this).val()));
    });
    inputNumRunsField.bind("change", function(e){
        INPUT_NUMBER_RUNS = $(this).val();
        localStorage.setItem("INPUT_NUMBER_RUNS",JSON.stringify($(this).val()));
    });
});

/*the main function*/
var main = function()
{
    n = genInput();

    doSort(n, RadixSort);
};

/*wrapper function that will log the time taken to do the sort for an input*/
var doSort = function(arr, sort)
{
    log("Before Sorting: ",n);

    var tempArr;
    var timeTaken = 0; /*variable used to calculate avg time taken based on INPUT_NUMBER_RUNS */

    for (var i=0; i< INPUT_NUMBER_RUNS; i++) {
        tempArr = n.slice(); /*make a copy of the original*/

        /*sort the copy however many times*/
        var before = performance.now();
        RadixSort(tempArr);
        var after = performance.now();
        timeTaken += (after-before); /*add the time up*/
    }
    timeTaken = timeTaken/INPUT_NUMBER_RUNS; /*calculate the avg time*/

    log("\nAfter sorting: ",tempArr);

    log("<b>"+displayTimer(timeTaken), "</b> For Length: ", INPUT_LENGTH," Max Int Length: ",INPUT_INTEGER_LENGTH," For "+INPUT_NUMBER_RUNS," runs");

    incrementLog();
};

/*counting sort function*/
var CountingSort = function(a, x)
{
    var n = a.length; /*length of the array in a variable*/
    var c = [];  /*create the array of counts*/
    var b = []; /*create the output array*/

    /*fill the array with empty values*/
    for (var i = 0; i < 10; i++)
        c[i] = 0;
    /*fill the array with empty values*/
    for (var i = 0; i < n; i++)
        b[i] = 0;

    /*loop through the array to be sorted and create counts of each integer*/
    for (var i = 0; i < n; i++) {
        c[Math.floor((a[i] / x) % 10)]++;
    }

    /*loop through C and compute the running sum of the counters c[i] is the num of elements in a that are <= to i */
    for (var i = 1; i < 10; i++) {
        c[i] += c[i-1];
    }

    /*loop through the array of counts and make the output array based on the input array's counts*/
    for (var i = n - 1; i >= 0; i--)
    {
        b[ c[ Math.floor((a[i]/x)%10) ] - 1] = a[i];
        c[ Math.floor((a[i]/x)%10) ]--;
    }

    /*copy new array back over original array*/
    for (var i=0; i < n; i++) {
        a[i] = b[i];
    }

};

/*radix sort with counting sort subroutine*/
var RadixSort = function(arr)
{
    var max = Math.max.apply(Math,arr); /*getting max value of the array*/

    /*do the loop for each digit*/
    for (var x=1; Math.floor(max/x) > 0; x *= 10) {
        CountingSort(arr, x);   /*call counting sort with a specific digit*/
    }

    /*return the beautifully sorted array*/
    return arr;
};

/*some helper functions*/
/*function to generate an input based on the global variables*/
var genInput = function()
{
    var n = [];

    for(var i=0;i<INPUT_LENGTH;i++)
    {
        n.push(Math.floor(Math.random() * INPUT_INTEGER_LENGTH));
    }

    return n;
};

/*helper function to display on the browser and console what is happening*/
var log = function()
{
    var toAppend = "";  /*create a toAppend string to avoid jquery parsing our strings to html too early*/
    toAppend += '<p class="log'+CURRENT_LOG+'">'; /*start the log entry*/
    toAppend += formatTime(new Date())+' - '; /*add the timestamp*/

    /*append all the arguments*/
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
        toAppend += arguments[i].toString();
    }
    toAppend += '</p>'; /*close the p tag*/

    /*after we pushed everything we want to the toAppend array, join it all together and append it*/
    logDiv.append(toAppend);
};

var incrementLog = function()
{
    logDiv.append('<hr class="log'+CURRENT_LOG+'" />');
    CURRENT_LOG++;
};

/*function to be called to clean up any messiness going on*/
var cleanUp = function()
{
    /*empty the log*/
    logDiv.empty();
};

/*function to be called to clean up any messiness going on except the last log entry*/
var cleanUpNotLast = function()
{
    /*empty the log except for the most recent log entry*/
    logDiv.children().not(".log"+(CURRENT_LOG-1)).remove();
};

/*function to format javascript timestamp correctly*/
var formatTime = function(timestamp)
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
};

/*function to display the time*/
var displayTimer = function(before, after)
{
    /*if we give it just a length of time, format that*/
    if (arguments.length == 1) {
        return  "Time Taken: "+Math.floor((before) * TIMER_ACCURACY) / TIMER_ACCURACY+" ms";
    } else { /*or we gave it an interval and we need to calculate the length of time*/
        /*return the string built with the timer information*/
        return  "Time Taken: "+Math.floor((after-before) * TIMER_ACCURACY) / TIMER_ACCURACY+" ms";
    }
};

/*checks local storage for a variable and returns it if it finds it or returns null if not*/
function checkLocalStorage(name, defaultValue)
{
    if (localStorage.getItem(name) != null) {
        //console.log(name,"loaded from local storage")
        var temp = localStorage.getItem(name);
        return JSON.parse(temp);
    } else {
        localStorage.setItem(name, defaultValue);
    }
};




