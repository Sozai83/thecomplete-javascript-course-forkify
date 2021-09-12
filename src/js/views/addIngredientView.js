import View from './view.js'

class addIngredientView extends View{
    _ingList = document.querySelector('.ing-list');
    _btnAddIngredient = document.querySelector('.btn--add-ingredient');
    _message = 'Recipe was successfully uploaded :)'

    addHandlerAddIngredient(handler){
        this._btnAddIngredient.addEventListener('click', function(e){
            e.preventDefault();
            handler();
        });
    }


    AddIngredients(){
        const ingElements = document.querySelectorAll('.ingredients');
        const ingLastEl = ingElements[ingElements.length -1];
        const ingNum = +ingLastEl.dataset.ing + 1;
        const markup = this._generateIngMarkup(ingNum);
        console.log(ingLastEl)
        ingLastEl.insertAdjacentHTML('afterend', markup);
    }

    _generateIngMarkup(num){
        return `
        <label>Ingredient ${num}</label>
          <div class="ingredients" data-ing=${num}>
            <input
              value=""
              type="text"
              class="ingredient"
              name="ingredient-${num}-qty"
              placeholder="Quantity"
            />
            <select name="ingredient-${num}-unit"
            class="ingredient select" id="ingUnit6">
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="cup">cup</option>
              <option value="tbs">tbs</option>
              <option value="ts">ts</option>
              <option value="">none</option>
            </select>
            <input 
              value=""
              class="ingredient desc"
              type="text"
              name="ingredient-${num}-desc"
              placeholder="Description"
            />
          </div>`
    }
}

export default new addIngredientView