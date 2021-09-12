import icons from 'url:../../img/icons.svg'; // parcel 2
import { state } from '../model.js';
import View from './view.js'

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const button = e.target.closest('.btn--inline');
            if(!button) return;
            const gotoPage = button.dataset.goto;
            handler(gotoPage);
        })
    }

    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const curPage = + this._data.page;
        return this._generatePageButtons(curPage, numPages);   
    }

    _generatePageButtons(page, numPages){

        const returnButton = `
        <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>
        `

        const forwardButton =`
        <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>    
        `

        const currentPage =`
        <span data-goto="${page}" class="pagination__curPage">
            ${page}
        </span>    
        `

        const spacer = `
        <span class="spacer"> </span>    
        `

        //we are at page 1 and there are other pages
        if(page === 1 && numPages > 1){
            return [spacer,currentPage, forwardButton].join('');
        }
        //we are on the page 1 and there is no other page
        //last page
        if(page=== numPages &&  numPages > 1){
            return [returnButton,currentPage,spacer].join('');
        }
        //other page
        if(page< numPages){
            return [returnButton,currentPage,forwardButton].join('');
        }
        return '';
    }
}

export default new PaginationView