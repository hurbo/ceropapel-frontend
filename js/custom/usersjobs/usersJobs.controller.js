(function () {
  'use strict';

  angular
    .module('app.usersJobs')
    .controller('UsersJobsController', UsersJobsController);
  UsersJobsController.$inject = ['$state', 'socket', 'swalFactory', 'JobTitles', 'profileFactory'];

  function UsersJobsController($state, socket, swalFactory, JobTitles, Profile) {
    var vm = this;


    vm.changeShowDetails = changeShowDetails;
    vm.changeRole = changeRole;
    vm.removePerson = removePerson;
    vm.changePerson = changePerson;
    vm.removeOldProfile = removeOldProfile;

    active();

    function active() {
      Profile.getProfile().then(function (profile) {
        vm.profile = profile;
        if (vm.profile.roleID === 1) {
          swalFactory.error('No puedes acceder al contenido');
          $state.go('app.mailbox.internal.in');
          return;
        } else {
          JobTitles.getSecretariates(profile, function (err, secretariates) {
            vm.secretariates = secretariates;
          });
        }
      });
    }



    function changeShowDetails(item) {



      item.showJobTitles = item.showJobTitles ? !item.showDetails : true;
      if (item.showJobTitles && !item.jobTitles) {

        socket.emit('getCompleteInfoOfJobTitlesBySecretariateID', item.id, function (error, jobTitles) {

          item.jobTitles = jobTitles;
        });
      }
    }

    function removeOldProfile(jobTittle) {

      JobTitles.removeOldProfile(jobTittle, function (err, data) {

        if (err) {
          swalFactory.error('Ocurrio un error', err.message);
        } else {
          swalFactory.success('Perfil actualizado', '');
          jobTittle.oldData = {};

        }
      });
    }


    function removePerson(user) {

      var data = {
        userID: user.userID,
        jobTitleID: user.jobTitleID
      };


      swal({
        title: '¿Quieres remover a ' + user.userName + ' del puesto actual?',
        showCancelButton: true,
        showLoaderOnConfirm: true,
      }).then(function (result) {
        JobTitles.removeUser(data, function (err, jt) {

          if (err) {
            swalFactory.error(err.message);
          } else {
            swalFactory.success('Puesto de trabajo actualizado correctamente');
            user.rolID = '';
            user.rolName = '';
            user.userEmail = '';
            user.userID = '';
            user.userName = '';
          }
        });
      });
    }

    function changePerson(oldUser) {

      swal({
        title: 'Selecciona a un usuario',
        input: 'select',
        inputOptions: _inputOptions(),
        inputPlaceholder: 'Selecciona un usuario',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        inputValidator: _inputValidator
      }).then(function (result) {

        result = result.split('-');
        var newUserID = parseInt(result[result.length - 1]);

        var data = {
          jobTitleID: oldUser.jobTitleID,
          oldUserID: oldUser.userID,
          newUserID: newUserID
        };


        JobTitles.changeUser(data, function (err, userEdit) {

          if (err) swalFactory.error(err.message);
          else {
            JobTitles.getCompleteInfoOfJobTitleByID(oldUser.jobTitleID, function (err, jt) {

              oldUser.rolID = jt.rolID;
              oldUser.rolName = jt.rolName;
              oldUser.userEmail = jt.userEmail;
              oldUser.userID = jt.userID;
              oldUser.userName = jt.userName;
              swalFactory.success('Se han guardado correctamente los cambios');
            });
          }
        });

      });
    }



    function changeRole(user) {

      swal({
        title: 'Asigne un rol al usuario ' + user.userName,
        input: 'select',
        inputOptions: {
          normal: 'Normal',
          admin: 'Admin',
          master: 'Master'
        },
        inputPlaceholder: 'Selecciona un rol',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        inputValidator: _inputValidator
      }).then(function (role) {

        var roleID = -1;
        switch (role) {
          case 'master':
            roleID = 3;
            break;
          case 'admin':
            roleID = 2;
            break;
          default:
            roleID = 1;
            break;
        }
        var data = {
          userID: user.userID,
          roleID: roleID
        };
        JobTitles.changeRoleUser(data, function (err, jt) {


          if (err) swalFactory.error(err.message);
          else {


            user.roleID = data.roleID;
            user.rolName = role;
            swalFactory.success('Se han guardado correctamente los cambios');
          }
        });
      });
    }

    function _inputOptions() {

      return new Promise(function (resolve) {
        JobTitles.usersWithOut(function (err, users) {

          var ops = {};
          if (!err) {
            for (var i = 0; i < users.length; i++) {
              var id = (users[i].name ? users[i].name : '') + '-' + users[i].id;
              // ops[users[i].id] = users[i].name;
              ops[id] = users[i].name;
            }
            resolve(ops);
          }
        });
      });
    }

    var roles = {
      normal: 1,
      admin: 2,
      master: 3
    };

    function _inputValidator(value) {

      return new Promise(function (resolve, reject) {
        value = value.split('-');
        value = value[value.length - 1];

        if (value !== '') {
          var Pvalue = roles[value];
          if (Pvalue) {
            resolve();
          } else {
            if (value) {
              resolve();
            } else {
              reject('El usuario seleccionado no se puede asignar al puesto de trabajo dos.\nContacte con un administrador');
            }
          }
        } else reject('Necesitas seleccionar un usuario');


      });
    }
  }
})();
