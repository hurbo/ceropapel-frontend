(function () {
  'use strict';

  angular
    .module('app.groups')
    .controller('groupsCreateController', groupsCreateController);
  groupsCreateController.$inject = [
    '$rootScope',
    'swangular',
    'Groups',
    'JobTitles',
    '$state',
    'profileFactory'
  ];

  function groupsCreateController(
    $rootScope,
    SweetAlert,
    Groups,
    JobTitles,
    $state,
    Profile
  ) {
    var vm = this;

    vm.secretariates = [];
    vm.members = [];

    vm.changeSecretariate = changeSecretariate;
    vm.addMember = addMember;
    vm.removeMember = removeMember;
    vm.saveGroup = saveGroup;

    active();

    function active() {

      Profile.getProfile().then(function (profile) {
        vm.profile = profile;

        vm.exclude = [];
        Groups.getGroups({}, function (err, groups) {
          for (let i = 0; i < groups.length; i++) {
            vm.exclude.push(groups[i].name);
          }

          JobTitles.getSecretariatesGroup(vm.profile, function (err, secretariates) {
            vm.secretariates = secretariates;
          });

          if ($state.is('app.groups.create')) {
            vm.formTitle = 'Crear grupo';
          } else {
            console.log("$state.params", parseInt( $state.params.id ));
            vm.formTitle = 'Editar grupo';
            Groups.getOne({
                group: parseInt( $state.params.id )
              },
              function (err, result) {
                console.log("result", result);
                vm.groupID = parseInt( $state.params.id );
                vm.name = result.name;
                vm.members = result.members;
              }
            );
          }
        });

      });
    }

    function changeSecretariate() {

      Groups.getUsers(vm.secretariate.id,
        function (err, jobTitles) {

          vm.jobTitles = _cleanJobTitles(jobTitles);
        }
      );
    }

    function addMember(jt) {

      if (jt.userID === vm.profile.id) {
        vm.jobTitles.splice(vm.jobTitles.indexOf(jt), 1);
      } else {

        vm.members.push(jt);
        vm.jobTitles.splice(vm.jobTitles.indexOf(jt), 1);
      }



    }

    function removeMember(member) {
      vm.secretariate = {};
      vm.jobTitles = {};
      _cleanJobTitles([]);
      vm.members.splice(vm.members.indexOf(member), 1);
    }

    function saveGroup() {
      if (vm.members.length === 0) {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'Agrega almenos a una persona',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#DD2C57',
          confirmButtonText: 'Aceptar',
          timer: 1200
        });
      }
      var group = {
        name: vm.name,
        members: _getMembers(),
        groupID: parseInt( $state.params.id ) || null
      };
      _validateGroup(group);
    }

    function _cleanJobTitles(jobTitles) {
      var jts = [];
      for (var i = 0; i < jobTitles.length; i++) {

        if (_findMember(jobTitles[i].userID) === -1) jts.push(jobTitles[i]);
      }
      return jts;
    }

    function _findMember(id) {
      var index = -1;
      for (var i = 0; i < vm.members.length; i++) {
        if (vm.members[i].userID === id) {
          index = i;
          break;
        }
      }
      return index;
    }

    function _getMembers() {
      var members = [];
      console.log("members", vm.members);
      for (var i = 0; i < vm.members.length; i++) {
        console.log("members", vm.members[i]);
        members.push(vm.members[i].jobTitleID);
      }
      return members;
    }

    function _validateGroup(group) {
      if (!group.name) return;
      if (group.members.length === 0) return;
      parseInt( $state.params.id ) ? _updateGroup(group) : _createGroup(group);
    }

    function _createGroup(group) {


      if (vm.exclude.indexOf(group.name) !== -1) {
        SweetAlert.swal({
          title: '¡Error!',
          text: 'El nombre de grupo ya esta en uso',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#253846',
          confirmButtonText: 'Aceptar'
        });
      } else {
        Groups.create(group, function (err, resutl) {

          if (!err) {

            SweetAlert.swal({
              title: 'Hecho!',
              text: 'El grupo se ha creado correctamente',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#253846',
              confirmButtonText: 'Aceptar',
              timer: 1000
            });
            Groups.getReloadOwn({}, function (err, groups) {
              $rootScope.$broadcast('reloadGroups');
              $state.go('app.groups.list');
            });
          } else {

            SweetAlert.swal({
              title: '¡Error!',
              text: err.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#DD2C57',
              confirmButtonText: 'Aceptar',
              timer: 1200
            });
          }
        });
      }

    }

    function _updateGroup(group) {

      group.id = vm.groupID;
      if (vm.exclude.indexOf(group.name) !== -1) {

        if (vm.groupID !== parseInt($state.params.id)) {
          SweetAlert.swal({
            title: '¡Error!',
            text: 'El nombre de grupo ya esta en uso',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#253846',
            confirmButtonText: 'Aceptar'
          });
          return;
        }
      }


      var datos = {
        id: parseInt($state.params.id),
        members : _getMembers(),
        name: vm.name
      }

      Groups.update(datos, function (err, resutl) {
        if (!err) {
          SweetAlert.swal({
            title: 'Hecho!',
            text: 'El grupo se ha actualizado correctamente',
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#253846',
            confirmButtonText: 'Aceptar',
            timer: 1000
          });
          Groups.getReloadOwn({}, function (err, groups) {
            $rootScope.$broadcast('reloadGroups');
            $state.go('app.groups.list');
          });

        } else {

          SweetAlert.swal({
            title: '¡Error!',
            text: err.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#DD2C57',
            confirmButtonText: 'Aceptar',
            timer: 1200
          });
        }
      });
    }
  }
})();
