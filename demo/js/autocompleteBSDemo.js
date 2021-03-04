const autoCompleteConfig = [{
    name: 'Input 1',
    debounceMS: 1500,
    minLength: 3,
    inputSource: document.getElementById('inputText1'),
    targetID: document.getElementById('inputID1'),
    fetchURL: 'example_url',
  },
  {
    name: 'Input 2',
    debounceMS: 300,
    minLength: 3,
    inputSource: document.getElementById('inputText2'),
    targetID: document.getElementById('inputID2'),
    fetchURL: 'example_url',
  }
];

// Initiate Autocomplete to Create Listeners
autocompleteBS(autoCompleteConfig);

// Optional Results Handler Function
function resulthandlerBS(name, selectedData){
  console.log(name);
  console.log(selectedData);
}

