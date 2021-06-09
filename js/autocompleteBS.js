class AutocompleteBS {

    get _options_default() {
        return {
            name: 'Default name',
            debounceMS: 250,
            minLength: 3,
            maxResults: 10,
            inputSource: null,
            targetID: null,
            fetchURL: null,
            fetchMap: {
                id: "id",
                caption: "txt"
            },
            requestMethod: 'POST',
            requestFieldName: 'txt',
            requestPreHandler: null,
            resultProcessor: null,
            resultError: null,
            optionSelected: null,
            noMatchesText: "No matches found",
            autocompleteClassName: "autocompletebs"
        }
    }

    constructor(optionsArr = {}, globalClickListener = true) {
        const _this = this

        if (globalClickListener) {
            document.addEventListener('click', function (e) {
                _this._clickCheckBS(e);
            });
        }

        optionsArr.forEach(function (config) {
            const currentConfig = Object.assign({}, _this._options_default, config)
            console.log(currentConfig);

            var updateValueDebounce = _this._debounce(function (e) {
                _this._handleInputBS(e, currentConfig);
            }, currentConfig.debounceMS);

            currentConfig.inputSource.classList.add(config.autocompleteClassName);
            currentConfig.inputSource.addEventListener('input', updateValueDebounce);
            currentConfig.inputSource.addEventListener('keydown', function (e) {
                _this._handleKeyDownBS(e, currentConfig);
            });
        });
    }


    _debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    clearListBS() {
        let autocompleteBSDiv = document.getElementById("autocompleteBS-list");
        if (autocompleteBSDiv != null) autocompleteBSDiv.remove();
    }

    _addResultsBS(config, results) {
        const _this = this;
        console.log('[' + config.name + '] Add Results');
        _this.clearListBS();
        const newDiv = document.createElement('div');
        const sourceBS = config.inputSource;

        newDiv.classList.add("autocompleteBS-items");
        newDiv.setAttribute('data-forinputbs', sourceBS.id);
        newDiv.setAttribute('data-current', -1);
        newDiv.setAttribute('data-results', results.length);

        console.log(results);

        if (results.length === 0) {
            console.log('[' + config.name + '] No Matches - Push a Message onto Results');
            let pseudoResult = {[config.fetchMap.id]: "noMatchesBS", [config.fetchMap.caption]: config.noMatchesText};
            results.push(pseudoResult);
        }
        newDiv.id = "autocompleteBS-list";
        let resultCounter = 0;

        results.forEach(function (result) {
            // console.log(result);
            let listDiv = document.createElement('div');
            let listInput = document.createElement('input');

            listDiv.innerHTML = result[config.fetchMap.caption];

            listInput.id = 'autoBS-' + resultCounter;
            listInput.setAttribute('value', result[config.fetchMap.caption]);
            listInput.setAttribute('data-id', result[config.fetchMap.id]);
            listInput.setAttribute('data-resultid', resultCounter);
            listInput.hidden = true;

            // console.log(listInput);

            listDiv.append(listInput);
            newDiv.append(listDiv);
            resultCounter++;
            // console.log(newDiv);
        });

        _this.results = results;

        newDiv.addEventListener("click", function (e) {
            _this._listValueClicked(e, results, config);
        });

        // console.log('Add autocompleteBS-list Input Source: ' + sourceBS.id);

        // console.log(newDiv);
        sourceBS.parentElement.append(newDiv);
    }

    _listValueClicked(e, results, config) {
        const _this = this;

        console.log('[' + config.name + '] Autocomplete List Click Event');
        // console.log(e.target);

        const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
        let totalResults = parseInt(autocompleteBSDiv.dataset.results);
        let inputSource = autocompleteBSDiv.dataset.forinputbs;

        if (totalResults === 0) {
            console.log('[' + config.name + '] not a valid entry');
            document.getElementById(inputSource).focus();
            return;
        }

        let selectedElement = e.target;
        let selectedValue = selectedElement.querySelector('input');

        config.inputSource.value = selectedValue.value;
        if (config.targetID != null) {
            config.targetID.value = selectedValue.dataset.id;
        }
        if ('function' === typeof config.optionSelected) {
            config.optionSelected(config.name, _this.results[selectedValue.dataset.resultid], config);

        } else if ('function' === typeof window.resultHandlerBS) {
            resultHandlerBS(config.name, _this.results[selectedValue.dataset.resultid]);
        }
        _this.clearListBS();
    }

    async _handleInputBS(e, config) {
        console.log('[' + config.name + '] handleInputBS');
        const _this = this;
        let inputValue = e.target.value;

        if (inputValue.length < config.minLength) {
            _this.clearListBS();
            return;
        }

        // console.log(e);
        // console.log(config);

        let fetchURL = config.fetchURL.replace('{term}', encodeURIComponent(inputValue));
        let req = {
            method: config.requestMethod,
            cache: 'no-cache'
        }
        if (config.requestMethod == "GET") {
            if (fetchURL == config.fetchURL) { // Term not present
                throw "{term} is not present in URL and requestMethod is GET";
            }
        } else {
            let reqBody = {[config.requestFieldName]: inputValue};
            if (typeof config.requestPreHandler === 'function') {
                reqBody = config.requestPreHandler(inputValue, config);
            }
            req["headers"] = {
                'Content-Type': 'application/json'
            }
            req["body"] = JSON.stringify(reqBody);
        }

        fetch(fetchURL, req)
            .then(response => response.json())
            .then(response => {
                console.log(response);

                let results = response;
                if (typeof config.resultProcessor === 'function') {
                    results = config.resultProcessor(response);

                } else if ("data" in response) {
                    results = response.data;
                }

                if (!Array.isArray(results)) {
                    console.log('[' + config.name + '] Was expecting an array from the Fetch API - Setting to Empty');
                    results = [];
                }
                if (results.length > config.maxResults) results.length = config.maxResults;
                _this._addResultsBS(config, results);

            }).catch((error) => {
            console.error('Error:', error);
            if (typeof config.resultError === 'function') {
                config.resultError(error);
            }
        });
    }

    _handleKeyDownBS(e, config) {
        const _this = this;
        const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
        const sourceBS = config.inputSource;

        if (!autocompleteBSDiv) return;

        let currentPosition = parseInt(autocompleteBSDiv.dataset.current);
        let totalResults = parseInt(autocompleteBSDiv.dataset.results);

        if (autocompleteBSDiv.dataset.forinputbs == e.target.id) {
            console.log('[' + config.name + '] Key Pressed: ' + e.keyCode);

            let keyPressed = parseInt(e.keyCode);
            let keyAction = '';

            if (keyPressed === 40 || keyPressed === 9) keyAction = 'down'
            if (keyPressed === 38 || (e.shiftKey && keyPressed == 9)) keyAction = 'up'
            if (keyPressed === 13) keyAction = 'enter';
            if (keyPressed === 27) keyAction = 'escape';

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
                    console.log('[' + config.name + '] New Position: ' + currentPosition);
                    autocompleteBSDiv.dataset.current = currentPosition;
                    _this._setPositionBS(config, currentPosition);
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
                    console.log('[' + config.name + '] New Position: ' + currentPosition);
                    autocompleteBSDiv.dataset.current = currentPosition;
                    _this._setPositionBS(config, currentPosition);
                    break;

                case 'enter':
                    e.preventDefault();
                    if (totalResults === 0) return;
                    console.log(currentPosition);

                    if (config.targetID != null) {
                        config.targetID.value = _this.results[currentPosition - 1][config.fetchMap.id];
                    }

                    _this.clearListBS();

                    if ('function' === typeof config.optionSelected) {
                        config.optionSelected(config.name, _this.results[currentPosition - 1], config);

                    } else if ('function' === typeof window.resultHandlerBS) {
                        resultHandlerBS(config.name, _this.results[currentPosition - 1]);
                    }
                    break;

                case 'escape':
                    e.preventDefault();
                    config.inputSource.value = '';
                    if (config.targetID != null) {
                        config.targetID.value = '';
                    }
                    _this.clearListBS();
                    break;
            }
        } else {
            console.log('[' + config.name + '] No Key Action');
        }
    }

    _setPositionBS(config, positionBS) {
        console.log('[' + config.name + '] setPositionBS');
        const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
        if (!autocompleteBSDiv) return;

        const listItems = Array.from(autocompleteBSDiv.children);

        listItems.forEach(function (listItem) {
            let selectedValue = listItem.querySelector('input');
            // console.log(selectedValue.dataset.resultid);
            if (parseInt(selectedValue.dataset.resultid) == positionBS - 1) {
                listItem.classList.add("autocompleteBS-active");
                config.inputSource.value = selectedValue.value;
            } else {
                listItem.classList.remove("autocompleteBS-active");
            }
        });
    }

    _clickCheckBS(e) {
        const autocompleteBSDiv = document.getElementById("autocompleteBS-list");
        console.log('clickCheckBS - Document Click Handler');

        if (!autocompleteBSDiv) return;

        console.log(autocompleteBSDiv.dataset)
        let sourceBS = autocompleteBSDiv.dataset.forinputbs;
        console.log(sourceBS)
        console.log(e.target.id);
        console.log(e.target.classList)

        if (sourceBS == e.target.id) {
            console.log('Clicked in Target: ' + sourceBS);
        } else {
            console.log('Clicked outside target with an active list - Send back to input');
            document.getElementById(sourceBS).focus();
        }
    }

}