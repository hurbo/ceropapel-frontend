(function () {
  'use strict';
  angular.module('app.general')
    .factory('fileList', fileList);

  function fileList() {
    var items;
    return {
      init: init,
      setItems: setItems,
      getItems: getItems,
      removeItem: removeItem,
      clear: clear
    };

    function init(_items) {
      // alert('file list init');
      if (_items !== undefined) {
        items = _items;
      } else {
        if (!items) {
          items = [];
        }
      }
    }

    function setItems(_items) {

      items = items.concat(_items);
    }

    function getItems() {
      return items;
    }

    function removeItem(item) {
      items.splice(items.indexOf(item), 1);
    }

    function clear() {
      items = [];
    }
  }
}());
