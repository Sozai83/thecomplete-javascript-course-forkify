import icons from 'url:../../img/icons.svg'; // parcel 2
import { state } from '../model.js';
import View from './view.js'

class addRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message = 'Recipe was successfully uploaded :)'
    _formRequired = 'Fields with "*" are required.';
    _formNumber = 'Quantity should be a number.';

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow()
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    _formValidation(){
        const labels = Array.from(document.querySelectorAll('form label'));
        const required = Array.prototype.slice.call(labels).filter(el => el.outerHTML.includes('*'));
        const checkFields = required.filter(req => {
            const input = req.nextSibling.nextSibling.innnerText || req.nextSibling.nextSibling.defaultValue;
            return (!input) ? true : false;
        });
        if(checkFields.length > 0) {

            return false;
        }

        return true
    }

    addHandlerUpload(handler){
        if(this._formValidation()){
            this._parentElement.addEventListener('submit', function(e){
                e.preventDefault();
                //we can get value of the form one by one too but it's easier if you use formdata api
                //FormData( pass an element in the form , )
                const dataArr = [...new FormData(this)];
                //convert array into object
                const dataObj = Object.fromEntries(dataArr);
                handler(dataObj);
            })
        }
    }

    _generateMarkup(){
        
    }
}

export default new addRecipeView