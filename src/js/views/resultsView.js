import View from './view.js'
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg';
import { state } from '../model.js';

class resultsView extends View {
    _parentElement = document.querySelector('.results');
    _sortBtn = document.querySelector('.sort');
    _sortOptions = document.querySelector('.sortOpt');
    _errorMessage = 'No recipe found with your query!  Please try anoter one.'
    _message = 'Success!'

    _generateMarkup(){
    return this._data.map(result => previewView.render(result, false)).join('');
    }

    toggleSortBtn(status){
        if(status === 'add'){
            this._sortBtn.classList.remove('hidden');
        }
        if(status === 'remove'){
            this._sortBtn.classList.add('hidden');
        }
    }

    addHandlerSortRecipe(handler){
        this._sortOptions.addEventListener('change', function(e){
            const sort = e.target.value;
            handler(sort);
        })
    }
}

export default new resultsView;