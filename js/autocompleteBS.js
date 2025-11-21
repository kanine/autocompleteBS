/**
 * AutocompleteBS - A lightweight, dependency-free autocomplete library for Bootstrap 5
 * Modernized with ES6+ Class, improved security, and accessibility.
 */
class AutocompleteBS {
  /**
   * @param {Object|Array<Object>} config - Configuration object or array of configuration objects
   */
  constructor(config) {
    if (Array.isArray(config)) {
      this.instances = config.map(cfg => new AutocompleteBSInstance(cfg));
    } else {
      this.instances = [new AutocompleteBSInstance(config)];
    }
  }
}

class AutocompleteBSInstance {
  constructor(config) {
    this.config = {
      name: 'Autocomplete',
      debounceMS: 300,
      minLength: 2,
      maxResults: 10,
      fetchMap: { id: 'id', name: 'name' },
      noMatchesMessage: 'No matching results',
      maxWidth: null,
      autoSelectSingleResult: true,
      ...config
    };

    if (!this.config.inputSource) {
      console.error('AutocompleteBS: inputSource is required');
      return;
    }

    this.results = [];
    this.currentFocus = -1;
    this.listId = `autocompleteBS-list-${Math.random().toString(36).substr(2, 9)}`;
    
    this.init();
  }

  init() {
    // Bind methods
    this.handleInput = this.debounce(this.handleInput.bind(this), this.config.debounceMS);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.repositionDropdown = this.repositionDropdown.bind(this);

    // Add Event Listeners
    this.config.inputSource.addEventListener('input', this.handleInput);
    this.config.inputSource.addEventListener('keydown', this.handleKeydown);
    
    // Accessibility attributes
    this.config.inputSource.setAttribute('autocomplete', 'off');
    this.config.inputSource.setAttribute('role', 'combobox');
    this.config.inputSource.setAttribute('aria-autocomplete', 'list');
    this.config.inputSource.setAttribute('aria-expanded', 'false');
    this.config.inputSource.setAttribute('aria-haspopup', 'listbox');
    
    // Global listeners (managed carefully)
    document.addEventListener('click', this.handleDocumentClick);
    window.addEventListener('scroll', this.repositionDropdown, true);
    window.addEventListener('resize', this.repositionDropdown);
  }

  /**
   * Debounce helper
   */
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Get nested property value safely
   */
  getNestedProperty(obj, path) {
    if (!path) return undefined;
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value == null) return undefined;
      value = value[key];
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : '';
    }
    return value;
  }

  async handleInput(e) {
    const inputValue = e.target.value;
    
    if (inputValue.length < this.config.minLength) {
      this.closeList();
      return;
    }

    const fetchURL = this.config.fetchURL.replace('{term}', encodeURIComponent(inputValue));

    try {
      const response = await fetch(fetchURL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      let data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('AutocompleteBS: Expected array from API, got', typeof data);
        data = [];
      }

      // Limit results
      if (data.length > this.config.maxResults) {
        data.length = this.config.maxResults;
      }

      this.results = data;

      // Auto-select if exactly one result (controlled by autoSelectSingleResult config)
      if (this.results.length === 1 && this.config.autoSelectSingleResult) {
        this.selectItem(this.results[0]);
        this.closeList();
        return;
      }

      this.renderList();

    } catch (error) {
      console.error('AutocompleteBS Fetch Error:', error);
      this.results = [];
      this.renderList(); // Render empty/no-matches state
    }
  }

  renderList() {
    this.closeList();
    
    if (this.results.length === 0) {
      this.renderNoMatches();
      return;
    }

    const listDiv = document.createElement('div');
    listDiv.id = this.listId;
    listDiv.className = 'list-group shadow-sm';
    listDiv.setAttribute('role', 'listbox');
    
    // Styling
    listDiv.style.position = 'absolute';
    listDiv.style.zIndex = '1050';
    listDiv.style.maxHeight = '300px';
    listDiv.style.overflowY = 'auto';
    
    // Width handling
    if (this.config.maxWidth) {
      if (this.config.maxWidth.startsWith('col-')) {
        const colNum = parseInt(this.config.maxWidth.split('-')[1]);
        const percentage = (colNum / 12) * 100;
        listDiv.style.width = `${percentage}%`;
      } else {
        listDiv.style.width = this.config.maxWidth;
      }
    } else {
      listDiv.style.width = `${this.config.inputSource.getBoundingClientRect().width}px`;
    }

    this.results.forEach((result, index) => {
      const item = document.createElement('button');
      item.type = 'button'; // Prevent form submission
      item.className = 'list-group-item list-group-item-action';
      item.setAttribute('role', 'option');
      item.id = `${this.listId}-item-${index}`;
      
      const displayName = this.getNestedProperty(result, this.config.fetchMap.name);
      
      // Security: Use textContent instead of innerHTML to prevent XSS
      item.textContent = displayName;
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectItem(result);
        this.closeList();
      });

      listDiv.appendChild(item);
    });

    document.body.appendChild(listDiv);
    this.repositionDropdown();
    
    this.config.inputSource.setAttribute('aria-expanded', 'true');
    this.config.inputSource.setAttribute('aria-controls', this.listId);
    this.currentFocus = -1;
  }

  renderNoMatches() {
    const listDiv = document.createElement('div');
    listDiv.id = this.listId;
    listDiv.className = 'list-group shadow-sm';
    
    listDiv.style.position = 'absolute';
    listDiv.style.zIndex = '1050';
    listDiv.style.width = `${this.config.inputSource.getBoundingClientRect().width}px`;

    const item = document.createElement('div');
    item.className = 'list-group-item text-muted';
    item.textContent = this.config.noMatchesMessage;
    
    listDiv.appendChild(item);
    document.body.appendChild(listDiv);
    this.repositionDropdown();
  }

  repositionDropdown() {
    const listDiv = document.getElementById(this.listId);
    if (!listDiv) return;

    const inputRect = this.config.inputSource.getBoundingClientRect();
    listDiv.style.top = `${inputRect.bottom + window.scrollY}px`;
    listDiv.style.left = `${inputRect.left + window.scrollX}px`;
    
    // Update width if not fixed
    if (!this.config.maxWidth) {
       listDiv.style.width = `${inputRect.width}px`;
    }
  }

  closeList() {
    const listDiv = document.getElementById(this.listId);
    if (listDiv) {
      listDiv.remove();
    }
    this.config.inputSource.setAttribute('aria-expanded', 'false');
    this.config.inputSource.removeAttribute('aria-activedescendant');
    this.currentFocus = -1;
  }

  selectItem(item) {
    const displayName = this.getNestedProperty(item, this.config.fetchMap.name);
    const idValue = this.getNestedProperty(item, this.config.fetchMap.id);

    this.config.inputSource.value = displayName;
    if (this.config.targetID) {
      this.config.targetID.value = idValue;
    }

    if (typeof this.config.onSelect === 'function') {
      this.config.onSelect(item);
    } else if (typeof window.resultHandlerBS === 'function') {
      // Legacy support
      window.resultHandlerBS(this.config.name, item);
    }
  }

  handleKeydown(e) {
    const listDiv = document.getElementById(this.listId);
    if (!listDiv) return;

    const items = listDiv.querySelectorAll('.list-group-item-action');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.currentFocus++;
      if (this.currentFocus >= items.length) this.currentFocus = 0;
      this.setActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.currentFocus--;
      if (this.currentFocus < 0) this.currentFocus = items.length - 1;
      this.setActive(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.currentFocus > -1) {
        items[this.currentFocus].click();
      }
    } else if (e.key === 'Escape') {
      this.closeList();
    } else if (e.key === 'Tab') {
      this.closeList();
    }
  }

  setActive(items) {
    items.forEach(item => item.classList.remove('active'));
    if (this.currentFocus === -1) return;
    
    const activeItem = items[this.currentFocus];
    activeItem.classList.add('active');
    
    // Scroll to view
    activeItem.scrollIntoView({ block: 'nearest' });
    
    // Accessibility
    this.config.inputSource.setAttribute('aria-activedescendant', activeItem.id);
  }

  handleDocumentClick(e) {
    if (e.target !== this.config.inputSource) {
      this.closeList();
    }
  }
}