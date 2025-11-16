'use strict';

const autoCompleteConfig = [{
    name: 'Countries by Capital',
    debounceMS: 250,
    minLength: 3,
    maxResults: 10,
    inputSource: document.getElementById('inputText1'),
    targetID: document.getElementById('inputID1'),
    fetchURL: 'https://restcountries.com/v3.1/capital/{term}',
    fetchMap: {id: "cca2",
               name: "capital"},
    noMatchesMessage: 'No matching capitals',
    onSelect: (selectedData) => {
      resultHandlerBS('Countries by Capital', selectedData);
    }
  },
  {
    name: 'Countries by Name',
    debounceMS: 300,
    minLength: 3,
    maxResults: 10,
    inputSource: document.getElementById('inputText2'),
    targetID: document.getElementById('inputID2'),
    fetchURL: 'https://restcountries.com/v3.1/name/{term}',
    fetchMap: {id: "cca2",
               name: "name.common"},
    onSelect: (selectedData) => {
      updateResults('Countries by Name', selectedData);
    }
  }
];

console.log(autoCompleteConfig);

// Initiate Autocomplete to Create Listeners
autocompleteBS(autoCompleteConfig);

function updateResults(inputName, selectedData) {
  console.log(inputName);
  console.log(selectedData);
}
