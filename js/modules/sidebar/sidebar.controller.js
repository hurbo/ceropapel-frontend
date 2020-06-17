/**=========================================================
* Module: sidebar-menu.js
* Handle sidebar collapsible elements
=========================================================*/

(function () {
  'use strict';

  angular
    .module('app.sidebar')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils', 'socket', 'profileFactory'];

  function SidebarController($rootScope, $scope, $state, SidebarLoader, Utils, socket, Profile) {

    activate();
    var vm = this;



    function activate() {


      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        socket.on('updateProfile-' + profile.id, function () {
          $state.reload();
          Profile.reloadProfile().then(function () {
            $rootScope.$broadcast('updateProfile');
            SidebarLoader.getMenu(sidebarReady);
          });
        });
      }, function (err) {
        console.error('Error addMember on getProfile', err);
      });





      var collapseList = [];
      // Comentado mientras se analiza una mejor implementación
      // setTimeout(function () {
      //   var e = document.getElementById('menuDocumentos');
      //   e.onclick = function () {
      //     window.open('/verificar-documento', '_blank');
      //   };
      // }, 4000);

      // demo: when switch from collapse to hover, close all items
      $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
        if (newVal === false && oldVal === true) {
          closeAllBut(-1);
        }
      });


      // Load menu from json file
      // -----------------------------------

      SidebarLoader.getMenu(sidebarReady);

      function sidebarReady(items) {
        $scope.menuItems = items;
      }

      // Handle sidebar and collapse items
      // ----------------------------------

      $scope.getMenuItemPropClasses = function (item) {
        return (item.heading ? 'nav-heading' : '') + (isActive(item) ? ' active' : '');
      };

      $scope.addCollapse = function ($index, item) {
        collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
      };

      $scope.isCollapse = function ($index) {
        return (collapseList[$index]);
      };

      $scope.toggleCollapse = function ($index, isParentItem) {

        // collapsed sidebar doesn't toggle drodopwn
        if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

        // make sure the item index exists
        if (angular.isDefined(collapseList[$index])) {
          if (!$scope.lastEventFromChild) {
            collapseList[$index] = !collapseList[$index];
            closeAllBut($index);
          }
        } else if (isParentItem) {
          closeAllBut(-1);
        }

        $scope.lastEventFromChild = isChild($index);

        return true;

      };

      // Controller helpers
      // -----------------------------------

      // Check item and children active state
      function isActive(item) {

        if (!item) return;

        if (!item.sref || item.sref === '#') {
          var foundActive = false;
          angular.forEach(item.submenu, function (value) {
            if (isActive(value)) foundActive = true;
          });
          return foundActive;
        } else
          return $state.is(item.sref) || $state.includes(item.sref);
      }

      function closeAllBut(index) {
        index += '';
        for (var i in collapseList) {
          if (index < 0 || index.indexOf(i) < 0)
            collapseList[i] = true;
        }
      }

      function isChild($index) {
        /*jshint -W018*/
        return (typeof $index === 'string') && !($index.indexOf('-') < 0);
      }

    } // activate
  }

})();
