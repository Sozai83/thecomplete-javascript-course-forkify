import * as model from './model.js'
import recipeView from './views/recipeview.js'
import searchView from './views/search.js'
import resultsView from './views/resultsView.js'
import PaginationView from './views/pagineationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import addIngredientView from './views/addIngredientView'
import {MODAL_CLOSE_SEC} from './config.js'
//import icons from '../img/favicon.png'; // parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function(){
  try{
    //const id = window.location.href.slice(window.location.href.indexOf("#") + 1);
    const id = window.location.hash.slice(1);
    if(! id) return;
    recipeView.renderSpinner();
    const recipes = (model.state.search.sortedResults.length !== 0) ? model.state.search.sortedResults : model.state.search.results;
    //0. results view to mark selected search result
    resultsView.update(model.getSearchResultPage(recipes));
    //render bookmark
    bookmarksView.update(model.state.bookmarks);

    //1. loading recipe
    await model.loadRecipe(id);
    const { recipe }  = model.state;
    
    //2. rendering recipe call recipeview.render
    recipeView.render(recipe);
  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlSeachResult = async function(){
  try{
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery();
    if(!query) return;

    //load recipe
    await model.loadSearchResult(query);

    //render results
    resultsView.render(model.getSearchResultPage());
    resultsView.toggleSortBtn('add');

    //render initial pagination
    PaginationView.render(model.state.search);
  }catch(err){
    console.error(err);
    resultsView.renderError();
    resultsView.toggleSortBtn('remove');
  }
}

const controlSortSearchResult = function(sort){
  try{
    //create sorted array
    model.sortRecipes(sort);
    //render sorted Arr
    resultsView.update(model.getSearchResultPage(model.state.search.sortedResults));
  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlPagination = function(gotoPage){
  try{
    const recipes = (model.state.search.sortedResults.length !== 0) ? model.state.search.sortedResults : model.state.search.results;
    resultsView.render(model.getSearchResultPage(recipes, gotoPage));
    PaginationView.render(model.state.search);
  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlServings = function(newServings){
  try{
    //update the recipe servings
    model.updateServings(newServings);
    //update the RecipeView
    const { recipe }  = model.state;
    recipeView.update(recipe);
  }catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlAddBookmark = function(){
  try{
    //add or remove bookmark
    if(!model.state.recipe.bookmarked){
      model.addBookmark(model.state.recipe);
    }else if(model.state.recipe.bookmarked){
      model.deleteBookmark(model.state.recipe.id)}
    //update recipe view
    recipeView.update(model.state.recipe);
    //render bookmark
    bookmarksView.render(model.state.bookmarks);
  }
  catch(err){
    console.error(err);
    recipeView.renderError();
  }
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
  addRecipeView.renderSpinner();
    //upload the new recipe data;
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //render recipe
  recipeView.render(model.state.recipe);

  //successMessage
  addRecipeView.renderMessage();

  //render bookmarkview
  bookmarksView.render(model.state.bookmarks);

  //use history API to change url pushState(state = can be null , title = '', url )
  window.history.pushState(null,'',  `${model.state.recipe.id}` )

  //close form window
  setTimeout(function(){ addRecipeView.toggleWindow()}, MODAL_CLOSE_SEC * 1000);


  }catch(err){
    console.error(`${err}`);
    addRecipeView.renderError(err.message)
  }
}

const controlAddIngredients = function(){
  addIngredientView.AddIngredients();
}

const newfeature = function(){
  console.log('Welcome to this application.')
}

const init = function(){
  bookmarksView.addHandler(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerChangeServings(controlServings);
  bookmarksView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSeachResult);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  resultsView.addHandlerSortRecipe(controlSortSearchResult);
  addIngredientView.addHandlerAddIngredient(controlAddIngredients);
  newfeature();
};
init();

