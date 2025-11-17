'use strict';

/**
 * Helper function to get nested property value from an object
 * Supports dot notation like "name.common" or "capital.0"
 * Also handles array values by returning the first element or joining them
 * @param {Object} obj - The object to traverse
 * @param {String} path - The property path (e.g., "name.common")
 * @returns {*} The value at the path, or undefined if not found
 */
function getNestedProperty(obj, path) {
  if (!path) return undefined;
  
  // Split the path by dots to handle nested properties
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value == null) return undefined;
    value = value[key];
  }
  
  // If the final value is an array, return the first element or join with comma
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : '';
  }
  
  return value;
}

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		const context = this;
		const args = arguments;
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function clearListBS() {
  console.log('Clearing List');
  const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
  if (autocompleteBSDiv !== null) autocompleteBSDiv.remove();
}

function addResultsBS(config, results) {
  console.log('Add Results');
  clearListBS();
  const newDiv = document.createElement('div');
  const sourceBS = config.inputSource;
  console.log(sourceBS.id);

  newDiv.classList.add("autocompleteBS-items");
  newDiv.setAttribute('data-forinputbs', sourceBS.id);
  newDiv.setAttribute('data-current', -1);
  newDiv.setAttribute('data-results', results.length);
  newDiv.setAttribute('data-results-json', JSON.stringify(results));

  console.log(results);

  if (results.length === 0) {
    console.log('No Matches - Push a Message onto Results');
    // Create pseudo result with direct property assignment for "no matches" message
    const noMatchesMessage = config.noMatchesMessage || 'No matching results';
    const pseudoResult = {};
    pseudoResult[config.fetchMap.id] = "noMatchesBS";
    pseudoResult[config.fetchMap.name] = noMatchesMessage;
    results.push(pseudoResult);
  }
  newDiv.id = "autocompleteBS-list";
  let resultCounter = 0;
  
  results.forEach((result) => {
    // console.log(result);
    const listDiv = document.createElement('div');
    const listInput = document.createElement('input');

    // Use helper function to get nested property values
    const displayName = getNestedProperty(result, config.fetchMap.name);
    const idValue = getNestedProperty(result, config.fetchMap.id);

    listDiv.innerHTML = displayName;

    listInput.id = 'autoBS-' + resultCounter;
    listInput.setAttribute('value', displayName);
    listInput.setAttribute('data-id', idValue);
    listInput.setAttribute('data-resultid', resultCounter);
    listInput.hidden = true;

    // console.log(listInput);

    listDiv.append(listInput);
    newDiv.append(listDiv);
    resultCounter++;
    // console.log(newDiv);

  });

    newDiv.addEventListener("click", (e) => {
      console.log('Autocomplete List Click Event');
      console.log(e.target);

      const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
      const totalResults = parseInt(autocompleteBSDiv.dataset.results);
      const inputSource = autocompleteBSDiv.dataset.forinputbs;

      if (totalResults === 0) {
        console.log('not a valid entry');
        document.getElementById(inputSource).focus();
        return;
      }
     
      let selectedElement = e.target;

      if (e.target.localName !== "div") selectedElement = e.target.parentElement; 
      const selectedValue = selectedElement.querySelector('input');
      config.inputSource.value = selectedValue.value;
      config.targetID.value = selectedValue.dataset.id;
      // Call onSelect callback if provided (new pattern)
      if (typeof config.onSelect === 'function') {
        config.onSelect(results[selectedValue.dataset.resultid]);
      }
      // Fallback to legacy global resultHandlerBS for backwards compatibility
      else if (typeof window.resultHandlerBS === 'function') {
        resultHandlerBS(config.name, results[selectedValue.dataset.resultid]);
      }
      clearListBS();
    });

  console.log('Add autocompleteBS-list Input Source: ' + sourceBS.id);

  // console.log(newDiv);
  sourceBS.parentElement.append(newDiv);

  }

function handleInputBS(e, config) {
  console.log('handleInputBS');
  const inputValue = e.target.value;
  
  if (inputValue.length < config.minLength) {
    clearListBS();
    return;
  }

  console.log(e);
  console.log(config);

  //const fetchURL = str.replace(config.fetchURL);
  const fetchURL = config.fetchURL.replace('{term}', encodeURIComponent(inputValue));
  console.log(fetchURL);

  //fetch(config.fetchURL + '?term='+ encodeURIComponent(inputValue) )
  fetch(fetchURL)
  .then(response => response.json())
  .then(response => {
      let results = response;
      console.log(results);
      if (!Array.isArray(results)) {
        console.log('Was expecting an array from the Fetch API - Setting to Empty');
        results = [];
      }
      if (results.length > config.maxResults) results.length = config.maxResults;
      // If exactly one result, auto-select and do not render the list
      if (results.length === 1) {
        try {
          const single = results[0];
          const displayName = getNestedProperty(single, config.fetchMap.name);
          const idValue = getNestedProperty(single, config.fetchMap.id);
          config.inputSource.value = displayName;
          config.targetID.value = idValue;
          // Call onSelect callback if provided (new pattern)
          if (typeof config.onSelect === 'function') {
            config.onSelect(single);
          }
          // Fallback to legacy global resultHandlerBS for backwards compatibility
          else if (typeof window.resultHandlerBS === 'function') {
            resultHandlerBS(config.name, single);
          }
        } catch (error) {
          console.error('Single result handling error:', error);
        }
        clearListBS();
        return;
      }
      addResultsBS(config, results);
  })
  .catch(error => console.error('Error:', error)); 

}

function handleKeyDownBS(e, config) {

  const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
  const sourceBS = config.inputSource;
  
  if (!autocompleteBSDiv) return;

  let currentPosition = parseInt(autocompleteBSDiv.dataset.current);
  const totalResults = parseInt(autocompleteBSDiv.dataset.results);

  if (autocompleteBSDiv.dataset.forinputbs === e.target.id) {
    // Use modern key property instead of deprecated keyCode
    const key = e.key;
    console.log('Key Pressed: ' + key);

    let keyAction = '';

    if (key === 'ArrowDown' || (key === 'Tab' && !e.shiftKey)) keyAction = 'down';
    if (key === 'ArrowUp' || (key === 'Tab' && e.shiftKey)) keyAction = 'up';
    if (key === 'Enter') keyAction = 'enter';
    if (key === 'Escape') keyAction = 'escape';

    if (keyAction === 'enter' && totalResults > 0 && currentPosition === -1) keyAction = 'down';

    if (keyAction) console.log(keyAction);
  
    switch (keyAction) {
      case 'down':
        e.preventDefault();
        if (totalResults === 0) return;
        if (currentPosition === -1) {
          currentPosition = 1;
        } else {
          currentPosition++;
        }
        if (currentPosition > totalResults) currentPosition = 1;
        console.log('New Position: ' + currentPosition);
        autocompleteBSDiv.dataset.current = currentPosition;
        setPositionBS(config, currentPosition);
        break;
      case 'up':
        e.preventDefault();
        if (totalResults === 0) return;
        if (currentPosition === -1) {
          currentPosition = 1;
        } else {
          currentPosition--;
        }
        if (currentPosition < 1) currentPosition = totalResults;
        console.log('New Position: ' + currentPosition);
        autocompleteBSDiv.dataset.current = currentPosition;
        setPositionBS(config, currentPosition);
        break;
      case 'enter':
        e.preventDefault();
        if (totalResults === 0) return;
        if (currentPosition === -1) return; // No item selected yet
        console.log(currentPosition);
        const results = JSON.parse(autocompleteBSDiv.dataset.resultsJson);
        const selectedResult = results[currentPosition - 1];
        config.inputSource.value = getNestedProperty(selectedResult, config.fetchMap.name);
        config.targetID.value = getNestedProperty(selectedResult, config.fetchMap.id);
        clearListBS();
        // Call onSelect callback if provided (new pattern)
        if (typeof config.onSelect === 'function') {
          config.onSelect(selectedResult);
        }
        // Fallback to legacy global resultHandlerBS for backwards compatibility
        else if (typeof window.resultHandlerBS === 'function') {
          resultHandlerBS(config.name, selectedResult);
        }
        break;
      case 'escape':
        e.preventDefault();
        config.inputSource.value = '';
        config.targetID.value = '';
        clearListBS();
        break;
    }
  } else {
    console.log('No Key Action');     
  }

}

function setPositionBS(config, positionBS) {
  console.log('setPositionBS');
  const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
  if (!autocompleteBSDiv) return;

  const listItems = Array.from(autocompleteBSDiv.children);

  listItems.forEach((listItem) => {
    const selectedValue = listItem.querySelector('input');
    // console.log(selectedValue.dataset.resultid);
    if (parseInt(selectedValue.dataset.resultid) === positionBS - 1) {
      listItem.classList.add("autocompleteBS-active");
      config.inputSource.value = selectedValue.value;
    } else {
      listItem.classList.remove("autocompleteBS-active");
    }
  });
  
}

function clickCheckBS(e, config) {

   const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
   console.log('clickCheckBS - Document Click Handler');

   if (!autocompleteBSDiv) return;

   const sourceBS = autocompleteBSDiv.dataset.forinputbs;

   if (sourceBS === e.target.id) {
     console.log('Clicked in Target: ' + sourceBS);
   } else {
     console.log('Clicked outside target with an active list - Send back to input');
     document.getElementById(sourceBS).focus();
   }

}


function autocompleteBS(configBS) {

  // General Document Level Click Handler
  document.addEventListener('click', (e) => { clickCheckBS(e); });

  configBS.forEach((config) => {
    
    const updateValueDebounce = debounce((e) => {
      handleInputBS(e, config);
    }, config.debounceMS);

    console.log(config.inputSource);
    config.inputSource.addEventListener('input', updateValueDebounce);
    config.inputSource.addEventListener('keydown', (e) => { handleKeyDownBS(e, config); });
    
  });

}