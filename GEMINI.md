# Project Overview
This project is a lightweight and dependency-free JavaScript library for adding autocomplete functionality to input fields, designed to work seamlessly with Bootstrap. It allows for simple configuration to fetch data from an external API and display autocomplete suggestions.

## Key Technologies
- **JavaScript (ES6+)**: The core logic is written in modern, vanilla JavaScript, ensuring no external library dependencies (like jQuery).
- **Bootstrap**: While the library is dependency-free, it is designed to be easily integrated into Bootstrap-based projects.
- **HTML5/CSS3**: The project uses standard HTML and CSS for its structure and styling.

## Architecture
The library consists of a main JavaScript file, `autocompleteBS.js`, which contains the core logic for handling user input, fetching data, and displaying suggestions. A CSS file, `autocompleteBS.css`, provides the necessary styling for the autocomplete dropdown. The library is configured by creating a JavaScript object with settings for each autocomplete instance.

# Building and Running
This is a client-side JavaScript library, so there is no build process required. To use the library, simply include the `autocompleteBS.js` and `autocompleteBS.css` files in your HTML.

## Running the Demo
To run the included demo, open the `demo/autocompleteBS.html` file in a web browser. The demo showcases two autocomplete fields: one for searching countries by capital and another for searching by country name.

# Development Conventions
- **Dependency-Free**: The project intentionally avoids external JavaScript libraries to remain lightweight and prevent dependency conflicts.
- **Configuration Object**: The library is configured using a JavaScript object, making it easy to set up and customize.
- **Debouncing**: A debounce function is used to limit the rate at which API requests are made, improving performance.
- **Callbacks**: A callback function (`resultHandlerBS`) can be used to handle the selected autocomplete result.
