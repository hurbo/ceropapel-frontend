(function () {
  'use strict';

  angular.module('app.mailbox')
    .factory('folderFactory', folderFactory);

  folderFactory.$inject = ['socket', 'ExternalsFactory'];

  function folderFactory(socket, ExternalsFactory) {
    return {
      createFolder: createFolder,
      deleteFolder: deleteFolder,
      editFolder: editFolder,
      getFavoriteFolders: getFavoriteFolders,
      getFavoriteOutFolders: getFavoriteOutFolders,
      getFavoriteFoldersOfBoss: getFavoriteFoldersOfBoss,
      getRootFoldersOfBoss: getRootFoldersOfBoss,
      getAllFolders: getAllFolders,
      getAllOutFolders: getAllOutFolders,
      getAllFoldersOfBoss: getAllFoldersOfBoss,
      getInfoOfFolder: getInfoOfFolder,
      getFolderPath: getFolderPath,
      getRootFolders: getRootFolders,
      getRootFoldersOut: getRootFoldersOut,
      getFolderByID: getFolderByID,
      changeFavoriteOption: changeFavoriteOption,


      get: get,
      getExternals: getExternals,
      archive: archive,
      archiveOut: archiveOut,
      unarchive: unarchive,
      unarchiveOut: unarchiveOut,
      archiveInboxes: archiveInboxes,
      unarchiveInboxes: unarchiveInboxes,


      getRootTreeFolders: getRootTreeFolders,
      getRootTreeFoldersOut: getRootTreeFoldersOut,

      getRootBossTreeFolders: getRootBossTreeFolders,
      getRootOutFoldersOfBoss: getRootOutFoldersOfBoss,
      getRootBossTreeFoldersOut: getRootBossTreeFoldersOut,

      getFavoriteOutFoldersOfBoss: getFavoriteOutFoldersOfBoss,
      getAllOutFoldersOfBoss: getAllOutFoldersOfBoss
    };

    function getRootOutFoldersOfBoss(data, cb) {

      ExternalsFactory.getCurrentBossjobTitleID(function (err, boos) {
        socket.emit('getRootOutFoldersOfBoss', boos, cb);
      });
    }

    function getRootBossTreeFoldersOut(data, cb) {

      ExternalsFactory.getCurrentBossjobTitleID(function (err, boos) {
        socket.emit('getRootBossTreeFoldersOut', boos, cb);
      });
    }


    function getFavoriteOutFoldersOfBoss(data, cb) {

      socket.emit('getFavoriteOutFoldersOfBoss', data, cb);
    }

    function getAllOutFoldersOfBoss(data, cb) {

      socket.emit('getAllOutFoldersOfBoss', data, cb);
    }

    function get(cb) {
      socket.emit('getFolders', {}, cb);
    }

    function getExternals(data, cb) {
      socket.emit('getExternalFolders', data, cb);
    }

    function archive(data, cb) {
      socket.emit('archiveDocument', data, cb);
    }

    function archiveOut(data, cb) {
      socket.emit('archiveDocumentOut', data, cb);
    }

    function archiveInboxes(data, cb) {

      socket.emit('archiveInboxes', data, cb);
    }


    function unarchiveInboxes(data, cb) {
      socket.emit('unarchiveInboxes', data, cb);
    }

    function unarchive(data, cb) {
      socket.emit('unarchiveDocument', data, cb);
    }

    function unarchiveOut(data, cb) {
      socket.emit('unarchiveDocumentOut', data, cb);
    }


    function createFolder(data, cb) {

      socket.emit('createFolder', data, cb);
    }

    function deleteFolder(folder, cb) {

      socket.emit('deleteFolder', folder, cb);
    }

    function editFolder(folder, cb) {

      socket.emit('editFolder', folder, cb);
    }

    function getAllFolders(data, cb) {

      socket.emit('getAllFolders', data, cb);
    }

    function getAllOutFolders(data, cb) {

      socket.emit('getAllOutFolders', data, cb);
    }

    function getAllFoldersOfBoss(id, cb) {

      socket.emit('getAllFoldersOfBoss', id, cb);
    }

    function getFavoriteFolders(data, cb) {

      socket.emit('getFavoriteFolders', data, cb);
    }

    function getFavoriteOutFolders(data, cb) {

      socket.emit('getFavoriteOutFolders', data, cb);
    }

    function getFavoriteFoldersOfBoss(id, cb) {

      socket.emit('getFavoriteFoldersOfBoss', id, cb);
    }

    function getFolderPath(data, cb) {

      socket.emit('getFolderPath', data, cb);
    }

    function getInfoOfFolder(data, cb) {

      socket.emit('getInfoOfFolder', data, cb);
    }

    function getRootFolders(data, cb) {

      socket.emit('getRootFolders', data, cb);
    }



    function getRootFoldersOfBoss(data, cb) {
      ExternalsFactory.getCurrentBossjobTitleID(function (err, boos) {
        socket.emit('getRootFoldersOfBoss', boos, cb);
      });
    }


    function getRootTreeFolders(data, cb) {
      socket.emit('getRootTreeFolders', data, cb);
    }

    function getRootTreeFoldersOut(data, cb) {
      socket.emit('getRootTreeFoldersOut', data, cb);
    }

    function getRootBossTreeFolders(data, cb) {
      ExternalsFactory.getCurrentBossjobTitleID(function (err, boos) {
        socket.emit('getRootBossTreeFolders', boos, cb);
      });
    }





    function getRootFoldersOut(data, cb) {

      socket.emit('getRootFoldersOut', data, cb);
    }

    function getFolderByID(id, cb) {

      socket.emit('getFolderByID', id, cb);
    }

    function changeFavoriteOption(folder, cb) {

      socket.emit('changeFavoriteOption', folder, cb);
    }







  }
})();
