import View from './view.js'
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg';

class bookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _triggerClickEl = document.querySelector('.recipe');
    _errorMessage = 'No bookmark yet. Find a nice recipe and bookmark.'
    _message = ''

    addHandler(handler){
      window.addEventListener('load', handler);
    }

    addHandlerAddBookmark(handler){
      this._triggerClickEl.addEventListener('click', function(e){
          const bookmarkBtn = e.target.closest('.btn-bookmark');
          if (!bookmarkBtn) return;
          handler();
      })
  }

    _generateMarkup(){
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new bookmarksView;
