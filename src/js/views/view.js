import icons from 'url:../../img/icons.svg';

export default class View{

    _errorMessage = 'We cannot find the recipe!  Please try anoter one.'
    _message = 'Success!'

    _clear(){
        this._parentElement.innerHTML = '';
    }

    /**
       * Render the received object to the DOM
       * @param(Object | Object[]]) // data to be rendered (e.g. recipe)
       * @param(boolean) [render = true] // If false, create a markup instead of rendering object to the DOM
       * @returns (undefined | string) A markup string is returned if false
       * @this View instance
       * @author Shiori Chiku
       * @todo finish XXXX
       */
    render(data , render = true){
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup(this._data);
        if(!render) return markup;
        this._clear();

        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data){
      this._data = data;
      const newMarkup = this._generateMarkup(this._data);
      //this will convert the string to actual DOM elements
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newEls = Array.from(newDOM.querySelectorAll('*'));
      const curEls =  Array.from(this._parentElement.querySelectorAll('*'));
      newEls.forEach((newEl,i) => {
        const curEl = curEls[i];
        // update Texts
        // Updates changed TEXT
        if (
          !newEl.isEqualNode(curEl) &&
          newEl.firstChild?.nodeValue.trim() !== ''
        ) {
          // console.log('💥', newEl.firstChild.nodeValue.trim());
          curEl.textContent = newEl.textContent;
        }
        //update changed attributes
        if (!newEl.isEqualNode(curEl)){
         Array.from(newEl.attributes).forEach(attr =>
           curEl.setAttribute(attr.name, attr.value))
        }
      })
    }

    renderSpinner = function(){
        const markup =`
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }


    renderError(message = this._errorMessage){
        const markup =`
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(successMessage = this._message){
        const markup =`
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${successMessage}</p>
          </div> 
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

}
