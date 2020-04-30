(function () {
  'use strict';

  angular
    .module('app.mailbox')
    .factory('externalSelectedFolder', externalSelectedFolder);

  externalSelectedFolder.$inject = [];

  function externalSelectedFolder() {
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