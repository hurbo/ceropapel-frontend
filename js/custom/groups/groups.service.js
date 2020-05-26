(function () {
  'use strict';

  angular.module('app.groups').factory('Groups', groupsFactory);

  groupsFactory.$inject = ['socket'];

  function groupsFactory(socket) {
    var currentGroup = null;
    var init = false;
    var groups = false;
    return {
      getReloadOwn: getReloadOwn,
      subscribe: subscribe,
      getOwn: getOwn,
      getUsers: getUsers,
      create: create,
      getMembers: getMembers,
      getOne: getOne,
      update: update,
      getCurrentGroup: getCurrentGroup,
      setCurrentGroup: setCurrentGroup,
      deleteGroup: deleteGroup,
      getGroups: getGroups,
      getById: getById
    };

    function subscribe() {
      var prosime = new Promise(function (resolve, reject) {
        resolve(init);
        if (!init) {
          init = true;
        }
      });
      return prosime;
    }

    function getGroups(data, cb) {
      socket.emit('getGroups', data, cb);
    }

    function deleteGroup(id, cb) {
      socket.emit('deleteGroup', id, cb);
    }

    function getCurrentGroup() {
      return currentGroup;
    }

    function setCurrentGroup(group) {
      currentGroup = group;
    }


    function getReloadOwn(id, cb) {
      socket.emit('getGroups', null, function (err, data) {

        groups = data;

        cb(err, groups);
      });
    }

    function getOwn(id, cb) {

      if (groups) {



        return cb(null, groups);
      } else {
        socket.emit('getGroups', null, function (err, data) {
          groups = data;



          cb(err, groups);
        });
      }
    }

    function getUsers(data, cb) {
      socket.emit('getUsersForGroups', data, cb);
    }

    function create(data, cb) {
      socket.emit('createGroup', data, cb);
    }

    function getMembers(data, cb) {
      socket.emit('getMembersOfGroup', data, cb);
    }

    function getOne(data, cb) {
      socket.emit('getGroup', data, cb);
    }
    function getById(data, cb) {
      socket.emit('getById', data, cb);
    }

    function update(data, cb) {
      socket.emit('updateGroup', data, cb);
    }
  }
})();
