import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime';
import {API_Key, API_URL, MODAL_CLOSE_SEC, ResultsPerPage} from './config.js'
import { AJAX } from './helpers.js'

export const state = {
    recipe : {},
    search : {
        query : '',
        results : [],
        sortedResults : [],
        resultsPerPage : ResultsPerPage,
        page : 1,
    },
    bookmarks : []
}

const createRecipe = function(data){
    const {recipe} = data.data
    return{
        id : recipe.id,
        title : recipe.title,
        publisher : recipe.publisher,
        srcUrl : recipe.source_url,
        img : recipe.image_url,
        coockingTime : recipe.cooking_time,
        ingredients : recipe.ingredients,
        servings : recipe.servings,
        ...(recipe.key && {key : recipe.key})
    }
}

export const loadRecipe = async function(id){
    try{
        const data = await AJAX(`${API_URL}${id}`);
        
        state.recipe = createRecipe(data);
        if(state.bookmarks.some(b => b.id === id)){
            state.recipe.bookmarked = true;
        }else{
            state.recipe.bookmarked = false;
        }
    }catch(err){
        console.error(`${err} in model.js`)
        throw err;
    }
}

export const loadSearchResult = async function(query){
    try{
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_Key}`);
        if(!data) new Error(err)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id : rec.id,
                title : rec.title,
                publisher : rec.publisher,
                img : rec.image_url,
                ...(rec.key && {key : rec.key})
            }
        })
        state.search.page = 1;
    }catch(err){
        throw err;
    }
}

export const getSearchResultPage = function(recipes = state.search.results, page = state.search.page){
    state.search.page = page;
    const start = (page - 1) * Number(state.search.resultsPerPage);
    const end = page * Number(state.search.resultsPerPage);
    return recipes.slice(start, end);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing =>{
        //new Q = old Q * new Q / old servings 2 * 8 / 4 = 4
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    })
    state.recipe.servings = newServings;  
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe){
    //set the recipe a bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id === state.recipe.id){
        state.recipe.bookmarked = true;
    }
    persistBookmarks();
}

export const deleteBookmark = function(id){
    //delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //mark current Recipe not bookemakred
    if(id === state.recipe.id){
        state.recipe.bookmarked = false;
    }
    persistBookmarks();
}

export const uploadRecipe = async function(newRecipe){
    try{
        const Allingredients = Object.entries(newRecipe).filter(entry => (entry[0].startsWith('ingredient')) ? true : false);
        let i = 1;
        let tempIng = [];
        const ingArr = Allingredients.map((ing) => {
            if(ing[0].startsWith(`ingredient-${i}-qty`)){
                tempIng = [];
                if(!ing[1]){
                    ing[1] = 0;
                }
                tempIng.push(ing[1]);
                return
            }
            if(ing[0].startsWith(`ingredient-${i}-unit`)){
                if(!ing[1]){
                    ing[1] = 0;
                }
                tempIng.push(ing[1]);
                return
            }
            if(ing[0].startsWith(`ingredient-${i}-desc`)){
                i++;
                if(!ing[1]) return;
                tempIng.push(ing[1]);
                return tempIng;
            }
        }).filter(entry => entry !== undefined ? true : false );
        const ingredients = ingArr.map(ing => {
            const [quantity, unit, description] = ing;
            return {quantity : (quantity && quantity !== 0) ? +quantity : null , 
                    unit : (unit && unit !== 0) ? unit : '',
                    description : description ? description : null,};
        });
        const recipe = {
            title : newRecipe.title,
            source_url : newRecipe.sourceUrl,
            image_url : newRecipe.image,
            publisher : newRecipe.publisher,
            cooking_time : +newRecipe.cookingTime,
            servings : +newRecipe.servings,
            ingredients
        };
        const data = await AJAX(`${API_URL}?key=${API_Key}`, recipe);
        state.recipe = createRecipe(data);
        addBookmark(state.recipe);
    }catch(err){
        throw err;
    }
}

export const sortRecipes = function(sort){
    try{
        const sortArr = [...state.search.results];
        if(sort === "alphabetical"){
            sortArr.sort(function(a,b){
                var nameA = a.title.toUpperCase(); // ignore upper and lowercase
                var nameB = b.title.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }                
            });
        }else if(sort === "id"){
            sortArr.sort(function(a,b){
                var nameA = a.id.toUpperCase(); // ignore upper and lowercase
                var nameB = b.id.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }                
            });
        }
        state.search.sortedResults = sortArr;
    }catch(err){
        throw err;
    }
}

export const varidateIngredients = function(){
    
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}
//clearBookmarks();