# autocompleteBS
A Javascript autocomplete library for Bootstrap.

### *** Note: Work in Progress (Alpha) - May contain multiple bugs *** ###

## Description
The intention of this library is to make it easier add autocomplete functionality for bootstrap projects. To date not a lot of effort has been made to make the library cross browser compatible but it does try to use vanillaJS to remove any dependencies on other librarys so it is not dependent on Bootstrap, that just happens to be my usecase.

## Features
* Simple drop in of small part of sample to bring text inputs to life
* Allow multiple autocompletes on the page
* Keyboard controls to navigate list (Up, Down, Tabbing, Escape and Enter)
* Use a GET fetch call with the 'term' variable set

## To Do List
* Filtering of results that come back raw (eg JSON lists of countries)
* More configration options, eg own search/regex functions
* Static lists without the use of Fetch
* Cross browser testing and confirmation
* Lot's more testing!