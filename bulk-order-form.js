/*
 * Shopify Bulk Order Form With Custom Properties
 *
 * Copyright (c) 2021 Jitaditya Seal (jitadityaseal.developer@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */ 
class BulkOrderForm extends HTMLElement {
    constructor(){
      super();
      //Selectors
      this.selectors = {
        form: 'form',
        numInputChange: '.num-change',
        propertiesPanelOpener: '.open-properties-panel',
        propertiesPanel: '.properties-panel',
        repeatPropertiesInput: '.repeat-properties',
        propertyInput: '[name^="items[][properties]"], [name^="property-input-checkbox-"]'
      }
      //Detect container width change
      const _this = this;
      this.detectContainerWidthChange();
      window.addEventListener('resize', function(){
        _this.detectContainerWidthChange();
      });
      //Number input change
      this.numberInputChange();
      //Toggle properties panel
      this.togglePropertiesPanel();
      //Repeat property values for all
      this.repeatProperties();
      //Change property input
      this.changePropertyInput();
      //Add to cart
      this.addToCartAjax();
    }
    detectContainerWidthChange(){
      if(!this.dataset.minContainerWidth) return;
      (this.querySelector(this.selectors.form).clientWidth > 0 && this.querySelector(this.selectors.form).clientWidth < this.dataset.minContainerWidth) ? this.classList.add('mobile-layout') : this.classList.remove('mobile-layout');
    }
    numberInputChange(){
      this.querySelectorAll(this.selectors.numInputChange) && [...this.querySelectorAll(this.selectors.numInputChange)].forEach(elem => {
        elem.addEventListener('click', event => {
            const numInput = event.currentTarget.parentNode.querySelector('input[type="number"]');
          const maxVal = numInput.hasAttribute('max') ? parseInt(numInput.getAttribute('max')) : false;
          const minVal = numInput.hasAttribute('min') ? parseInt(numInput.getAttribute('min')) : 1;
          let numVal = parseInt(numInput.value);
          if(event.currentTarget.classList.contains('num-plus')){
            if(!maxVal || maxVal > numVal) numVal += 1;
          } else if(event.currentTarget.classList.contains('num-minus')){
            if(minVal < numVal) numVal -= 1;
          }
          numInput.value = numVal;
        });
      });
    }
    togglePropertiesPanel(){
      this.querySelectorAll(this.selectors.propertiesPanelOpener) && [...this.querySelectorAll(this.selectors.propertiesPanelOpener)].forEach(elem => {
        elem.addEventListener('click', event => {
          this.querySelector(this.selectors.propertiesPanel+'[data-id="'+elem.dataset.open+'"]') && this.querySelector(this.selectors.propertiesPanel+'[data-id="'+elem.dataset.open+'"]').classList.toggle('hidden');
        });
      });
    }
    repeatProperties(){
      this.querySelector(this.selectors.repeatPropertiesInput) && this.querySelector(this.selectors.repeatPropertiesInput).addEventListener('change', event => {
        let initialInputs = [];
        const currentPanel = this.querySelector(this.selectors.propertiesPanel+'[data-id="'+event.currentTarget.dataset.panel+'"]');
        if(event.currentTarget.checked && currentPanel && currentPanel.querySelectorAll(this.selectors.propertyInput)){
          const allInputs = currentPanel.querySelectorAll(this.selectors.propertyInput);
          [...allInputs].forEach(inputEl => {
            let obj = {};
            obj.name = inputEl.getAttribute('name');
            obj.value = inputEl.value;
            obj.checked = (inputEl.getAttribute('type') === 'checkbox') ? inputEl.checked : false;
            obj.node = inputEl.cloneNode(true);
            initialInputs.push(obj);
          });
          this.querySelectorAll(this.selectors.propertiesPanel) && [...this.querySelectorAll(this.selectors.propertiesPanel)].forEach(elem => {
            elem.querySelectorAll(this.selectors.propertyInput) && [...elem.querySelectorAll(this.selectors.propertyInput)].forEach((inputEl, index) => {
              let inputObj = initialInputs[index];
              if(inputEl.getAttribute('type') === 'checkbox'){
                  if(inputEl.getAttribute('name') && inputEl.value === inputObj.value){
                    inputEl.checked = inputObj.checked ? true : false;
                  } 
              } else {
                if(inputEl.getAttribute('name') && inputEl.getAttribute('name') === inputObj.name){
                  if(inputEl.getAttribute('type') === 'file'){
                    inputEl.parentNode.replaceChild(inputObj.node.cloneNode(true), inputEl);
                  } else  {
                    inputEl.value = inputObj.value;
                  }
                }
              }
            });
          });
        }
      });
    }
    changePropertyInput(){
      this.querySelectorAll(this.selectors.propertyInput) && [...this.querySelectorAll(this.selectors.propertyInput)].forEach(elem => {
        elem.addEventListener('change', event => {
            this.querySelector(this.selectors.repeatPropertiesInput).checked = false;
          if(event.currentTarget.getAttribute('type') === 'checkbox'){
            const checkboxInputs = event.currentTarget.parentNode.parentNode.querySelectorAll('input[type="checkbox"][name="'+event.currentTarget.getAttribute('name')+'"]');
            let checkedValues = [];
            [...checkboxInputs].forEach(checkboxElem => {
                if(checkboxElem.checked) checkedValues.push(checkboxElem.value);
            });
            let checkedValuesString = checkedValues.length > 0 ? checkedValues.join(', ') : '';
            console.log(checkedValues);
            event.currentTarget.parentNode.parentNode.querySelector('[name="'+event.currentTarget.dataset.name+'"]').value = checkedValuesString;
          }
        });
      });
    }
    addToCartAjax(){
      this.querySelector(this.selectors.form) && this.querySelector(this.selectors.form).classList.contains('ajax-submit') && this.querySelector(this.selectors.form).addEventListener('submit', event => {
        event.preventDefault();
        const formElement = event.currentTarget;
          const formData = new FormData(formElement);
        const sectionsInResponse = ['cart-summary']; //sections to be returned in response
        formData.append('sections', sectionsInResponse);
        const addToCartButton = formElement.querySelectorAll('[type="submit"]');
        let emptyInputs = [], invalidFiles = [], validQtyInputFound = false; 
        //check for at least one quantty field with value more than 0
        formElement.querySelectorAll('input[name="items[][quantity]"]') && [...formElement.querySelectorAll('input[name="items[][quantity]"]')].forEach(inputElement => {
          if(parseInt(inputElement.value) > 0) {
            validQtyInputFound = true;
            return false;
          }
        });
        if(!validQtyInputFound){
          alert("Value of at least one quantity input must be greater than 0");
          return false;
        }
        //check for required inputs with no values
        formElement.querySelectorAll('[required]') && [...formElement.querySelectorAll('[required]')].forEach(inputElement => {
          if(!inputElement.value) emptyInputs.push(inputElement.getAttribute('name').replace('properties[','').replace(']','').trim());
        });
        if(emptyInputs.length > 0){
          emptyInputs.length > 1 ? alert('"'+emptyInputs.join(', ')+'" fields are required') : alert('"'+emptyInputs[0]+'" field is required');
          return false;
        }
        //check for invalid file formats
        formElement.querySelectorAll('input[type="file"]') && [...formElement.querySelectorAll('input[type="file"]')].forEach(inputElement => {
          const validFormats = inputElement.getAttribute('accept') ? inputElement.getAttribute('accept').toLowerCase().replace(/(\s+),(\s+)/g, ',').split(',') : false;
          if(inputElement.files.length > 0 && validFormats.length > 0){
            const type = inputElement.files[0].type, ext = '.'+inputElement.files[0].name.split('.')[inputElement.files[0].name.split('.').length - 1];
            if(validFormats.indexOf(type) === -1 && validFormats.indexOf(ext) === -1 && validFormats.filter(format => { return format.split('/')[0].trim() == type.split('/')[0].trim() && format.split('/')[1].trim() == '*' }).length === 0) invalidFiles.push(inputElement.getAttribute('name').replace('properties[','').replace(']','').trim());
          }
        });
        if(invalidFiles.length > 0){
          invalidFiles.length > 1 ? alert('File formats for "'+invalidFiles.join(', ')+'" fields are invalid') : alert('File format for "'+invalidFiles[0]+'" field is invalid');
          return false;
        }
        sectionsInResponse.forEach(section => { document.querySelector('#shopify-section-'+section) && document.querySelector('#shopify-section-'+section).remove(); });
        [...addToCartButton].forEach(elem => {
          elem.setAttribute('disabled', true);
          elem.value = elem.dataset.textAdding;
        });
        //use fetch to send post data
        fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then((response) => response.json())
        .then((data) => {
          //check for sections data
          if(!data.sections){
            console.log('no sections found in response...');
          } else {
            for (const key in data.sections) {
              if (data.sections.hasOwnProperty(key)) {
                //insert section html
                document.body.insertAdjacentHTML('beforeend', data.sections[key]);
                //show section
                document.querySelector('#shopify-section-'+key).classList.add('active');
              }
            }	
          }
        })
        .catch((e) => {
           console.error(e);
        })
        .finally(() => {
           //enable add to cart button
           [...addToCartButton].forEach(elem => {
             elem.removeAttribute('disabled');    
             elem.value = elem.dataset.textAtc;
           });
        });
        });
    }
  }
  customElements.define('bulk-order-form', BulkOrderForm);