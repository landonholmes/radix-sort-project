/*global $,console,_, Chart*/
/*variables*/
var logDiv = $("div#log"),
    mainButton = $("button#main"),
    cleanButton = $("button#clean"),
    cleanNotLastButton = $("button#cleanKeepLast"),
    resetInputsButton = $("button#resetInputs"),
    inputLenField = $("input#inputLen"),
    inputNumMaxField = $("input#inputNumMax"),
    inputNumRunsField = $("input#inputNumRuns"),
    inputSeeArraysCheckbox = $("input#seeArraysCheckbox"),
    inputOrderRadios = $("input.inputOrder"),
    inputCompareWithCheck = $("input.compareWithCheck"),
    canvasContainer = $("div#canvasContainer");

var DEFAULT_INPUT_LENGTH = 1000,
    DEFAULT_INPUT_INTEGER_MAX = 1000,
    DEFAULT_INPUT_NUMBER_RUNS = 100,
    CANVAS_OBJECT = '<br/><p>Time Taken By Each Sort</p><table><tr><td>Time Taken (ms)&nbsp;&nbsp;</td><td><canvas id="myChart" width="600" height="400"></canvas></td><tr><tr><td colspan="2">Sort</td></tr></table>',
    TIMER_ACCURACY = 1000,
    inputLength = checkLocalStorage("inputLength", DEFAULT_INPUT_LENGTH),
    inputIntegerMax = checkLocalStorage("inputIntegerMax", DEFAULT_INPUT_INTEGER_MAX),
    inputNumberRuns = checkLocalStorage("inputNumberRuns",DEFAULT_INPUT_NUMBER_RUNS),
    currentLog = 1,
    seeArrays = checkLocalStorage("seeArrays",JSON.stringify(true)),
    inputOrder = checkLocalStorage("inputOrder","random"),
    currArr, /*global variable to keep track of current array*/
    compareWithChecks = checkLocalStorage("compareWithChecks",[]), /*variable to keep track of which other sorts to compare with*/
    compareWithTimes = []; /*variable to keep track of times of compared sorts*/

    /*when the page is loaded, run this stuff*/
$(document).ready( function() {
    main();  /*call the main function*/

    /*populate input with variables*/
    inputLenField.val(inputLength);
    inputNumMaxField.val(inputIntegerMax);
    inputNumRunsField.val(inputNumberRuns);

    /*populate compare other sorts checkboxes*/
    for (var i=0; i < compareWithChecks.length; i++) {
        $('input[value='+compareWithChecks[i]+']').prop('checked', true);
    }
    /*check if seeArrays has been set to true*/
    if (seeArrays) {
        inputSeeArraysCheckbox.prop('checked',true); /*check the seeArrays checkbox*/
    }
    inputOrderRadios.filter('[value='+inputOrder+']').prop('checked',true); /*select the radio button*/


    /*some event binders*/
    mainButton.bind("click", main);  /*run main function when mainButton is clicked*/
    cleanButton.bind("click", cleanUp); /*run cleanUp function when cleanButton is clicked*/
    cleanNotLastButton.bind("click", cleanUpNotLast);  /*run cleanUpNotLast function when cleanNotLastButton is clicked*/
    resetInputsButton.bind("click", resetInputs);  /*run resetInputs function when resetInputsButton is clicked*/
    $("input").bind("keypress", checkInput);  /*run checkInput function when any input has a keypress*/

    /*bind the input length field on keyup event*/
    inputLenField.bind("keyup", function(){
        inputLength = $(this).val(); /*set variable to value*/
        localStorage.setItem("inputLength",$(this).val()); /*set the local storage*/
    });
    /*bind the inputNumMaxField on keyup event*/
    inputNumMaxField.bind("keyup", function(){
        inputIntegerMax = $(this).val(); /*set variable to value*/
        localStorage.setItem("inputIntegerMax",$(this).val()); /*set the local storage*/
    });
    /*bind the inputNumRunsField on keyup event*/
    inputNumRunsField.bind("keyup", function(){
        inputNumberRuns = $(this).val(); /*set variable to value*/
        localStorage.setItem("inputNumberRuns",$(this).val());  /*set the local storage*/
    });
    /*bind the inputOrderRadios on change event*/
    inputOrderRadios.bind("change", function(){
        inputOrder = $(this).val();  /*set variable to value*/
        localStorage.setItem("inputOrder",JSON.stringify($(this).val()));  /*set the local storage*/
    });
    /*bind the inputSeeArraysCheckbox on change event*/
    inputSeeArraysCheckbox.bind("change", function(){
        seeArrays = inputSeeArraysCheckbox.prop("checked"); /*set variable to value*/
        localStorage.setItem("seeArrays",JSON.stringify(inputSeeArraysCheckbox.prop("checked")));  /*set the local storage*/
    });
    /*bind the inputCompareWithCheck on change event*/
    inputCompareWithCheck.bind("change", function(){
        checked = inputCompareWithCheck.filter(":checked"); /*set checked to checked boxes*/
        compareWithChecks = []; /*reset function names to compare with*/
        for (var i=0; i < checked.length; i++) {
            compareWithChecks.push(checked[i].value); /*add all the checked ones to function names*/
        }
        localStorage.setItem("compareWithChecks",JSON.stringify(compareWithChecks));  /*set the local storage*/
    });
});

/*the main function*/
function main()
{
    currArr = genInput();  /*generate the input*/

    compareWithTimes = []; /*clear this out*/
    canvasContainer.html(""); //clear

    var tempArr = currArr.slice();   /*put array in temp array to preserve global variable*/
    doSort(tempArr, radixSort); /*do the radix sort*/

    /*then do any other sorts that were chosen to compare with*/
    for (var i=0; i < compareWithChecks.length; i++) {
        doSort(tempArr, getFunctionByName(compareWithChecks[i])); /*do specific sort (by name)*/
    }

    /*if another sort was chosen to compare with*/
    if (compareWithTimes.length > 1)
    {
        /*sort the times from least to greatest*/
        compareWithTimes = _.sortBy(compareWithTimes, 'timeTaken');
        log("Time Comparison: (input order: ",inputOrder,")"); /*title the log*/
        /*loop through times to display*/
        $.each(compareWithTimes, function(key,value){
            log(value.name,": sorted in ", value.timeTaken, "ms"); /*show time for specific sort*/
        });

        /*if we are comparing times, let's do a chart*/
        canvasContainer.html(CANVAS_OBJECT); //overwrite canvas
        drawChart();
    }

    /*increment the current log*/
    incrementLog();
}

/*wrapper function that will log the time taken to do a sort for an input*/
function doSort(arr, sort)
{
    log("Using <strong>",sort.name,"</strong>");

    /*check if they want to see the arrays*/
    if (seeArrays) {
        log("Before Sorting: ",currArr);
    }


    var tempArr;  /*make a temp array variable so we don't overwrite original */
    var timeTaken = 0; /*variable used to calculate avg time taken based on inputNumberRuns */

    /*loop runs for a specific number of times*/
    for (var i=0; i< inputNumberRuns; i++) {
        tempArr = arr.slice(); /*make a copy of the original*/

        /*sort the copy however many times*/
        var before = performance.now(); /*start the timer*/
        sort(tempArr); /*do the sort*/
        var after = performance.now(); /*stop the timer*/
        timeTaken += (after-before); /*add the time up*/
    }
    timeTaken = timeTaken/inputNumberRuns; /*calculate the avg time*/

    /*check if they want to see the arrays*/
    if (seeArrays) {
        log("\nAfter sorting: ",tempArr);
    }

    /*display some sort info in the log*/
    log("<b>"+displayTimer(timeTaken), "</b> For Length: ", inputLength," Max Int Length: ",inputIntegerMax," For "+inputNumberRuns," runs");

    /*add a pretty line between sorts*/
    logDiv.append('<hr class="log'+currentLog+'" />');

    /*add an entry for sort to the timing log*/
    compareWithTimes.push({"name":sort.name,"timeTaken": Math.floor((timeTaken) * TIMER_ACCURACY) / TIMER_ACCURACY});
}

/*counting sort function*/
function countingSort(a, x)
{
    var len = a.length; /*length of the array in a variable*/
    var c = [];  /*create the array of counts*/
    var b = []; /*create the output array*/
    var i;  /*create index variable so we don't have to create several times*/

    /*fill the c array with empty values*/
    for (i = 0; i < 10; i++) {
        c[i] = 0;
    }
    /*fill the b array with empty values*/
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
function radixSort(arr)
{
    var max = Math.max.apply(Math,arr); /*getting max value of the array*/

    /*do the loop for each digit*/
    for (var x=1; Math.floor(max/x) > 0; x *= 10) {
        countingSort(arr, x);   /*call counting sort with a specific digit*/
    }

    /*return the beautifully sorted array*/
    return arr;
}

/* ---------- some helper functions ---------- */
/*function to generate an input based on the global variables*/
function genInput()
{
    var n = []; /*make an empty array*/

    /*loop to create a specific length array*/
    for(var i=0;i<inputLength;i++) {
        /*generate and add a random number between 0 and the max*/
        n.push(Math.floor(Math.random() * inputIntegerMax));
    }

    /*check the order the user wants the input in, default is random*/
    switch(inputOrder) {
        case "ordered": {n=radixSort(n); break;} /*if input is to be ordered first*/
        case "orderedBackwards": {n = radixSort(n).reverse(); break;}  /*if input is to be ordered backwards*/
        case "default": { break;} /*random*/
    }

    /*return the input*/
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
        console.log(arguments[i]); /*console.log the argument*/
        toAppend += arguments[i].toString(); /*add the argument to the log string*/
    }
    toAppend += '</p>'; /*close the p tag*/

    /*after we pushed everything we want to the toAppend array, join it all together and append it*/
    logDiv.append(toAppend);
}

/*function to increment the log counter, might have other functionality*/
function incrementLog()
{
    currentLog++;
}

/*function to be called to clean up any messiness going on*/
function cleanUp()
{
    logDiv.empty();  /*empty the log*/
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
    if (localStorage.getItem(name) != null) { /*if we find the entry in localStorage*/
        return JSON.parse(localStorage.getItem(name)); /*retrieve and return the found entry*/
    } else { /*entry not found*/
        localStorage.setItem(name, JSON.stringify(defaultValue)); /*create the entry*/
        return defaultValue; /*return it after creating it*/
    }
}

/*function to check input for non-numerics and block them*/
function checkInput(e)
{
    var regex = new RegExp('^[0-9]+$'); /*regex to check for only numerical input*/
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode); /*get the key pressed from event*/
    var charCode = (!e.charCode ? e.which : e.charCode); /*get the character code*/
    switch(charCode) { /*switch on the character code*/
        case 8: { break;} /*do nothing on backspace*/
        case 13: { mainButton.click(); /*if enter was pressed, run the sort*/ break;}
        default: {
            if (!regex.test(key)) { /*if key does not match regex*/
                e.preventDefault(); //block back input
            }
        }
    }
}

/*function to reset all inputs back to defaults, even the local storage*/
function resetInputs()
{
    /*set variables to defaults*/
    inputLength = DEFAULT_INPUT_LENGTH;
    inputIntegerMax = DEFAULT_INPUT_INTEGER_MAX;
    inputNumberRuns = DEFAULT_INPUT_NUMBER_RUNS;
    seeArrays = true;
    inputOrder = "random";
    compareWithChecks = [];

    /*reset localStorage values*/
    localStorage.setItem("inputLength",inputLength);
    localStorage.setItem("inputIntegerMax",inputIntegerMax);
    localStorage.setItem("inputNumberRuns",inputNumberRuns);
    localStorage.setItem("seeArrays",JSON.stringify(seeArrays));
    localStorage.setItem("inputOrder",JSON.stringify(inputOrder));
    localStorage.setItem("compareWithChecks",JSON.stringify(compareWithChecks));

    /*reset the html inputs*/
    inputLenField.val(inputLength);
    inputNumMaxField.val(inputIntegerMax);
    inputNumRunsField.val(inputNumberRuns);
    inputSeeArraysCheckbox.prop('checked',true);
    inputOrderRadios.filter('[value='+inputOrder+']').prop('checked',true);
    inputCompareWithCheck.prop('checked',false);
}

/*a function to call a specific function by name, works for window functions*/
function getFunctionByName(functionName)
{
    return window[functionName];
}

/*function to draw a chart, calling this will redraw over the current chart*/
function drawChart()
{
    var data = {
        labels: [],
        datasets: []
    }; //creating the data struct for the chart
    var datasetTimeTaken = [];

    $.each(compareWithTimes, function(key,value){
        data.labels.push(value.name);
        datasetTimeTaken.push(value.timeTaken);
    });

    /*making the dataset of the data struct for the chart*/
    var dataset = {
        label: "Time Taken For Each Sort",
        fillColor: "rgba(151,187,205,0.5)",
        strokeColor: "rgba(151,187,205,0.8)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: datasetTimeTaken
    };
    data.datasets.push(dataset);

    var ctx = $("#myChart").get(0).getContext("2d");

    var options = {
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 5,
        barDatasetSpacing : 1,
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
        //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var barChart = new Chart(ctx).Bar(data);


}




