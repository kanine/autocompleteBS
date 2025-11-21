# autocompleteBS (alpha)
A Javascript autocomplete library for Bootstrap.

## Description
The intention of this library is to make it easier add autocomplete functionality for webdev projects. To date not a lot of effort has been made to make the library cross browser compatible but it does use Vanilla JS to remove any dependencies on other JavaScript libraries. The library now uses Bootstrap 5 classes exclusively for styling, eliminating the need for custom CSS.

Demo: [Lookups by Capital or Country](https://kanine.github.io/autocompleteBS/demo/autocompleteBS.html)

## Features
* Simple configuration to add autocomplete function to an input field
* Allow multiple autocompletes on the page, and the ability to add additional post document load
* Configurable Debounce, Min Input Length and Max Results to display per input
* Keyboard controls to navigate list (Up, Down, Tabbing, Escape and Enter to Select)
* Source autocomplete data from an external API
* Assume the source will supply additional properties that can be used in a result handler callback function
* **NEW**: Dropdown positioning works correctly in Bootstrap navbars and complex layouts
* **NEW**: Optional `maxWidth` configuration to control dropdown width using Bootstrap column classes (e.g., `col-4`, `col-6`)
* **NEW**: Uses Bootstrap 5 classes exclusively - no custom CSS required
* Automatically repositions dropdown on scroll and resize events

## To Do List
* Filtering of results that come back raw, eg JSON lists of countries
* More configration options, eg own search/regex functions
* Static lists without the use of Fetch
* Cross browser testing
* A lot more testing and error handling!

## Installation
* The easiest thing to do right now is to check out the [demo](https://kanine.github.io/autocompleteBS/demo/autocompleteBS.html)
* Installation typically involves configuring an object as in the example and then pass this to the function autocompleteBS()
* **NEW**: No need to include `autocompleteBS.css` - the library now uses Bootstrap 5 classes exclusively
* Using the demo is pretty self explanatory and self contained
* See sample JS code here: [Demo JS](https://github.com/kanine/autocompleteBS/blob/main/demo/js/autocompleteBSDemo.js)

### Basic Usage

```html
<!-- Include Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Your input field -->
<input type="text" class="form-control" id="myInput">
<input type="hidden" id="myInputID">

<!-- Include autocompleteBS.js -->
<script src="path/to/autocompleteBS.js"></script>
<script>
  const config = [{
    name: 'My Autocomplete',
    debounceMS: 250,
    minLength: 3,
    maxResults: 10,
    maxWidth: 'col-4', // Optional: limit dropdown width
    inputSource: document.getElementById('myInput'),
    targetID: document.getElementById('myInputID'),
    fetchURL: 'https://api.example.com/search/{term}',
    fetchMap: {id: "id", name: "name"},
    onSelect: (selectedData) => {
      console.log('Selected:', selectedData);
    }
  }];
  
  new AutocompleteBS(config);
</script>
```

### Configuration Options

* `name`: String - Name identifier for the autocomplete instance
* `debounceMS`: Number - Milliseconds to wait before making API call
* `minLength`: Number - Minimum characters before triggering search
* `maxResults`: Number - Maximum number of results to display
* `maxWidth`: String (optional) - Maximum width for dropdown. Can be a Bootstrap column class (e.g., 'col-4', 'col-6') or a CSS value (e.g., '300px')
* `inputSource`: HTMLElement - The input field element
* `targetID`: HTMLElement - Hidden field to store selected ID
* `fetchURL`: String - API endpoint URL with `{term}` placeholder
* `fetchMap`: Object - Maps API response properties to {id, name}
* `noMatchesMessage`: String (optional) - Custom "no results" message
* `autoSelectSingleResult`: Boolean (optional, default: true) - When true, automatically selects single search results. When false, shows the result in the dropdown list
* `onSelect`: Function (optional) - Callback when item is selected

## Contributions
I am happy to consider any and all contributions that support the stated features. The intention is for this repo to be used in modern browsers and I'm naturally keen to learn better ways to do the things that are accomplished already. The only rule I have is to no shared libraries as this is intended to be completely stand-alone. One of the reasons I made this was many other examples introduce dependencies that I found were often out of date.

### Feedback
I am not a professional developer by anyone's calculation, so if you have feedback or suggestions of areas of improvement please just raise an issue and I will help where I can. If anyone wishes to help collaborate just let me know.
