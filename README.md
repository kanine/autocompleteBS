# autocompleteBS (alpha)
A Javascript autocomplete library for Bootstrap.

## Description
The intention of this library is to make it easier add autocomplete functionality for webdev projects. To date not a lot of effort has been made to make the library cross browser compatible but it does use Vanilla JS to remove any dependencies on other JavaScript libraries. Any use of bootstrap is optional.

Demo: [Lookups by Capital or Country](https://kanine.github.io/autocompleteBS/demo/autocompleteBS.html)

## Features
* Simple configuration to add autocomplete function to an input field
* Allow multiple autocompletes on the page, and the ability to add additional post document load
* Configurable Debounce, Min Input Length and Max Results to display per input
* Keyboard controls to navigate list (Up, Down, Tabbing, Escape and Enter to Select)
* Source autocomplete data from an external API
* Assume the source will supply additional properties that can be used in a result handler callback function

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

## Contributions
I am happy to consider any and all contributions that support the stated features. The intention is for this repo to be used in modern browsers and I'm naturally keen to learn better ways to do the things that are accomplished already. The only rule I have is to no shared libraries as this is intended to be completely stand-alone. One of the reasons I made this was many other examples introduce dependencies that I found were often out of date.

### Feedback
I am not a professional developer by anyone's calculation, so if you have feedback or suggestions of areas of improvement please just raise an issue and I will help where I can. If anyone wishes to help collaborate just let me know.
