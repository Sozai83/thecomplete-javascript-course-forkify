import icons from 'url:../../img/icons.svg'; // parcel 2
import { Fraction } from 'fractional'
import View from './view.js'

class RecipeView extends View{
    _parentElement = document.querySelector('.recipe');
    _data;
    
    addHandlerRender(handerFunction){
        // ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handerFunction));
        window.addEventListener('hashchange', handerFunction);
        window.addEventListener('load', handerFunction);
    }

    addHandlerChangeServings(handler){
        this._parentElement.addEventListener('click', function(e){
            const updateServingbtn = e.target.closest('.btn--update-servings');
            if(!updateServingbtn) return;
            const {updateto} = updateServingbtn.dataset;
            if(updateto > 0) handler(updateto);
        })
    }
    
    _generateMarkup(recipe) {
        return `
        <figure class="recipe__fig">
            <img src="${recipe.img}" crossorigin="anonymous" alt="${recipe.title}" class="recipe__img"/>
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
            </figure>

            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.coockingTime}</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-updateto="${Number(recipe.servings) - 1}">
                    <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-updateto="${Number(recipe.servings) + 1}">
                    <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
                </div>
            </div>

            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                <svg>
                <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn-bookmark">
                <svg class="">
                <use href="${icons}#icon-bookmark${(this._data.bookmarked)? '-fill' : ''}"></use>
                </svg>
            </button>
            </div>

            <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${(recipe.ingredients) ? recipe.ingredients.map(ing => this._generateMarkupIngredient(ing)).join('') : ''}
            </ul>
            </div>

            <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
                directions at their website.
            </p>
            <a
                class="btn--small recipe__btn"
                href="${recipe.srcUrl}"
                target="_blank"
            >
                <span>Directions</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </a>
            </div>
        `
    }
    _generateMarkupIngredient(ing){
        return `<li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${(ing.quantity) ? new Fraction(ing.quantity).toString() :'Some'}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                </div>
                </li>`
    }
}

export default new RecipeView();