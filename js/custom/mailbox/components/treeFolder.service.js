(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .factory('treeFolderFactory', treeFolderFactory);

  treeFolderFactory.$inject = [];

  function treeFolderFactory() {
    var selectedFolder = null;

    return {
      getSelectedFolder: getSelectedFolder,
      setSelectedFolder: setSelectedFolder,
    };

    function getSelectedFolder() {
      return selectedFolder;
    }

    function setSelectedFolder(folder) {
      selectedFolder = folder;
    }
  }

}());