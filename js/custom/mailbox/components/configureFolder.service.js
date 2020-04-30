(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .factory('configureFolderFactory', configureFolderFactory)


  function configureFolderFactory() {
    var folderToEdit = null;
    return {
      getSelectedFolder: getSelectedFolder,
      setSelectedFolder: setSelectedFolder,
    };

    function getSelectedFolder() {
      return folderToEdit;
    }

    function setSelectedFolder(data) {
      folderToEdit = data;
    }
  }

}());