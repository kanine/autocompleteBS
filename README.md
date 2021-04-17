# autocompleteBS (alpha)
A Javascript autocomplete library for Bootstrap.

## Description
The intention of this library is to make it easier add autocomplete functionality for bootstrap projects. To date not a lot of effort has been made to make the library cross browser compatible but it does use vanilla JS to remove any dependencies on any other JavaScript libraries.

Demo: [Lookups by Capital or Country](https://kanine.github.io/autocompleteBS/demo/autocompleteBS.html)

## Features
* Simple configuration to add autocomplete to inputs
* Allow multiple autocompletes on the page
* Keyboard controls to navigate list (Up, Down, Tabbing, Escape and Enter)
* Use a GET fetch call with the 'term' variable set

## To Do List
* Filtering of results that come back raw, eg JSON lists of countries
* More configration options, eg own search/regex functions
* Static lists without the use of Fetch
* Cross browser testing
* A lot more testing and error handling!

## Installation
* The easiest thing to do right now is to check out the [demo](https://kanine.github.io/autocompleteBS/demo/autocompleteBS.html)
* Installation typically involves configuring an object as in the example and then pass this to the function autocompleteBS()
* The results will display under the parent element that has the class autocompleteBS so that there is a placeholder for results to be inserted
* Using the demo is pretty self explanatory and self contained
* See sample JS code here: [Demo JS](https://github.com/kanine/autocompleteBS/blob/main/demo/js/autocompleteBSDemo.js)

### Feedback
I am not a professional developer by anyone's calculation, so if you have feedback or suggestions of areas of improvement please just raise an issue and I will help where I can. If anyone wishes to help collaborate just let me know.
