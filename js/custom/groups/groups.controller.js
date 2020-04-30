(function () {
  'use strict';

  angular.module('app.groups').controller('groupsController', groupsController);
  groupsController.$inject = ['Groups', '$rootScope', '$state'];

  function groupsController(Groups, $rootScope, $state) {
    var vm = this;
    var showDetails = {};

    vm.changeShowDetails = changeShowDetails;
    vm.showMembers = showMembers;


    active();

    function active() {


      Groups.subscribe().then(function (init) {
        if (!init) {
          $rootScope.$on('reloadGroups', function () {

            vm.groups = null;

            Groups.getReloadOwn({}, function (err, groups) {
              vm.groups = groups;
              $state.reload();

            });
          });
        }
      });

      Groups.getOwn({}, function (err, groups) {
        vm.groups = groups;
      });


    }

    function changeShowDetails(item) {

      showDetails[item.id] = showDetails[item.id] ? false : true;
      if (showDetails[item.id]) {
        Groups.getMembers(item.id, function (err, members) {
          item.members = err ? [] : members;
        });
      }
    }

    function showMembers(id) {
      return showDetails[id];
    }
  }
})();
